"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";
import { error } from "console";

interface editCandidateEducationProps {
  educationId: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  certificateUrl?: string;
  certificatePublicId?: string;
}

export default async function editCandidateEducationAction(
  data: editCandidateEducationProps,
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
      },
    });

    if (!candidateProfile) {
      return { error: "Candidate profile not found" };
    }

    if (!candidateProfile.isActive) {
      return { error: "Candidate profile is not active" };
    }

    const education = await prisma.candidateEducation.findUnique({
      where: {
        id: data.educationId,
      },
    });

    if (!education || education.candidateId !== candidateProfile.id) {
      return { error: "No education record found " };
    }

    const institution = data.institution.trim();
    const degree = data.degree.trim();
    const field = data.field?.trim();
    const startDate = data.startDate;
    const endDate = data.isCurrent ? null : (data.endDate ?? null);
    const oldCertificatePublicId = education.certificatePublicId;
    const newCertificateurl = data.certificateUrl?.trim() || null;
    const newCertificatePublicId =
      data.certificatePublicId?.trim() || null;

    if (!institution || !degree || !startDate) {
      return { error: "institution , degree and starting date is required" };
    }

    if (
      (!newCertificateurl && newCertificatePublicId) ||
      (newCertificateurl && !newCertificatePublicId)
    ) {
      return { error: "A new certificate URL and public ID are both required" };
    }

    await prisma.candidateEducation.update({
      where: {
        id: education.id,
      },
      data: {
        institution,
        degree,
        field,
        startDate,
        endDate,
        certificateUrl: newCertificateurl,
        certificatePublicId: newCertificatePublicId,
        isCurrent: data.isCurrent,
      },
    });

    if (
      oldCertificatePublicId &&
      newCertificatePublicId &&
      oldCertificatePublicId !== newCertificatePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(oldCertificatePublicId, {
          resource_type: "raw",
        });
      } catch (error) {
        return { error: "Could not delete the old resume" };
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
