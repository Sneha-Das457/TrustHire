"use server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface UpdateCandidateActionProps {
  headline: string;
  location: string;
  resumeUrl?: string;
  resumePublicId?: string;
  resumeName?: string;
  bio?: string;
  phone?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default async function updateCandidateAction(
  data: UpdateCandidateActionProps,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const candidateProfile = await prisma.candidate.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        isActive: true,
        resumeUrl: true,
        resumeName: true,
        resumePublicId: true,
      },
    });

    if (!candidateProfile) {
      return { error: "Candidate profile not found" };
    }

    if (!candidateProfile.isActive) {
      return { error: "Candidate profile is not active" };
    }
    const headline = data.headline.trim();
    const location = data.location.trim();
    const oldResumePublicId = candidateProfile.resumePublicId;
    const newResumeUrl = data.resumeUrl?.trim() || undefined;
    const newResumePublicId = data.resumePublicId?.trim() || undefined;

    if (!headline || !location) {
      return { error: "Headline and location are required" };
    }

    if (
      (newResumeUrl && !newResumePublicId) ||
      (!newResumeUrl && newResumePublicId)
    ) {
      return { error: "A new resume URL and public ID are both required" };
    }

    await prisma.candidate.update({
      where: { id: candidateProfile.id },
      data: {
        headline,
        location,
        resumeUrl: newResumeUrl ,
        resumePublicId: newResumePublicId ,
        resumeName: data.resumeName?.trim() || null,
        bio: data.bio?.trim() || null,
        phone: data.phone?.trim() || null,
        portfolioUrl: data.portfolioUrl?.trim() || null,
        githubUrl: data.githubUrl?.trim() || null,
        linkedinUrl: data.linkedinUrl?.trim() || null,
      },
    });

    if (
      oldResumePublicId &&
      newResumePublicId &&
      oldResumePublicId !== newResumePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(oldResumePublicId, {
          resource_type: "raw",
        });
      } catch (error) {
        return { error: "Could not delete the old resume"}
      }
    }

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: String(err) };
  }
}
