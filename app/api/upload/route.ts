import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import type { UploadApiResponse } from "cloudinary";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getUploadError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const cloudinaryError = error as {
      http_code?: unknown;
      message?: unknown;
    };

    if (cloudinaryError.http_code === 403) {
      return "Cloudinary denied this upload (403). Enable Upload API access for the configured API key.";
    }

    if (typeof cloudinaryError.message === "string") {
      return cloudinaryError.message;
    }
  }

  return "An unknown error occured during the upload. Please try again later.";
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const uploadFile = formData.get("file");

    if (!(uploadFile instanceof File) || uploadFile.size === 0) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (uploadFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the maximum limit" },
        { status: 400 },
      );
    }

    if (!ALLOWED_FILE_TYPES.has(uploadFile.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 },
      );
    }

    const bytes = await uploadFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next_flowdesk",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else
              reject(new Error("Cloudinary did not return an upload result"));
          },
        );
        uploadStream.end(buffer);
      },
    );

    return NextResponse.json(
      {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Image upload failed", error);
    return NextResponse.json({ error: getUploadError(error) }, { status: 502 });
  }
}
