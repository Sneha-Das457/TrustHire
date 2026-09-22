"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface candidateEducationProps {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  certificateUrl?: string;
}

export default async function createCandidateEducationAction(
  data: candidateEducationProps,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const candidateProfile = await prisma.candidate.findUnique({
      where: { userId: session.user.id },
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

    const institution = data.institution.trim();
    const degree = data.degree.trim();
    const field = data.field?.trim();
    const startDate = data.startDate;
    const endDate = data.isCurrent ? null : (data.endDate ?? null);
    const certificateUrl = data.certificateUrl?.trim() || null;

    if (!institution || !degree || !startDate) {
      return { error: "institution , degree and starting date is required" };
    }

    await prisma.candidateEducation.create({
      data: {
        candidate: {
          connect: { id: candidateProfile.id },
        },
        institution,
        degree,
        field,
        startDate,
        endDate,
        certificateUrl,
        isCurrent: data.isCurrent,
      },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: String(err) };
  }
}
