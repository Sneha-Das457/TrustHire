"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface candidateSkillProps {
  skillId: string;
  level?: string;
}

export default async function createCandidateSkillAction(
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

    const skillId = data.skillId.trim();
    const level = data.level?.trim();

    if (!skillId) {
      return { error: "SkillId is required" };
    }

    await prisma.candidateSkill.create({
      data: {
        candidate: {
          connect: { id: candidateProfile.id },
        },
        skill : {
            connect: { id: skillId}
        },
        level
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

