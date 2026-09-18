"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { error } from "console";
import { headers } from "next/headers";

interface CandidateExperienceProps {
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export default async function createCandidateExperienceAction(
  data: CandidateExperienceProps,
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

    const company = data.company.trim();
    const position = data.position.trim();
    const stratDate = data.startDate;

    if (!company || !position || stratDate) {
      return { error: "These fields are required" };
    }

    const experience = await prisma.candidateExperience.create({
      data: {
        candidate: {
          connect: { id: candidateProfile.id },
        },
        company: data.company,
        position: data.position,
        description: data.description?.trim() || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
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
