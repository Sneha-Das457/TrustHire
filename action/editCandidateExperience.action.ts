"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface editCandidateExperienceProps {
  experienceId: string;
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export default async function editCandidateExperienceAction(
  data: editCandidateExperienceProps,
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

    const experience = await prisma.candidateExperience.findUnique({
      where: {
        id: data.experienceId,
      },
    });

    if (!experience || experience.candidateId !== candidateProfile.id) {
      return { error: "experience not found or unauthorized" };
    }

    const company = data.company.trim();
    const position = data.position.trim();
    const startDate = data.startDate;
    const endDate = data.isCurrent ? null : (data.endDate ?? null);

    if (!company || !position) {
      return { error: "Company, position, and start date are required" };
    }

    if (!data.isCurrent && !endDate) {
      return { error: "End date is required for a previous job" };
    }

    if (endDate && endDate < startDate) {
      return { error: "End date cannot be earlier than start date" };
    }

    await prisma.candidateExperience.update({
      where: {
        id: experience.id,
      },
      data: {
        company,
        position,
        description: data.description?.trim() || null,
        startDate,
        endDate,
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


