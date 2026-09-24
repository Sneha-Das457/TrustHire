"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface candidateSkillProps {
  CandidateSkillId: string;
  level?: string;
}

export default async function editCandidateSkillAction(
  data: candidateSkillProps,
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

    const skill = await prisma.candidateSkill.findUnique({
      where: {
        id: data.CandidateSkillId,
      },
    });

    if (!skill || skill.candidateId !== candidateProfile.id) {
      return { error: "skill not found or unauthorized" };
    }

    await prisma.candidateSkill.update({
      where: {
        id: data.CandidateSkillId,
      },
      data: {
        level: data.level?.trim(),
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
