"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { UserRole } from "@/lib/generated/prisma/enums";
import { headers } from "next/headers";

export default async function deActivateCandidateAction() {
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
      return { error: "Candidate profile is already deactivated" };
    }

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateProfile.id },
        data: { isActive: false },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { role: UserRole.DEFAULT_USER },
      }),
    ]);

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: String(err) };
  }
}
