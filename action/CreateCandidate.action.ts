"use server";

import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

interface CreateCandidateActionProps {
  headline: string;
  location: string;
  resumeUrl: string;
  resumeName?: string;
  bio?: string;
  phone?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default async function createCandidateAction(
  data: CreateCandidateActionProps,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (existingCandidate) {
      return { error: "Candidate profile already exists" };
    }

    const headline = data.headline.trim();
    const location = data.location.trim();
    const resumeUrl = data.resumeUrl.trim();

    if (!headline || !location || !resumeUrl) {
      return { error: "Headline, location, and resume are required" };
    }

    await prisma.$transaction([
      prisma.candidate.create({
        data: {
          userId: session.user.id,
          headline,
          location,
          resumeUrl,
          resumeName: data.resumeName?.trim() || null,
          bio: data.bio?.trim() || null,
          phone: data.phone?.trim() || null,
          portfolioUrl: data.portfolioUrl?.trim() || null,
          githubUrl: data.githubUrl?.trim() || null,
          linkedinUrl: data.linkedinUrl?.trim() || null,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { role: UserRole.CANDIDATE },
      }),
    ]);

    return { error: null };
  } catch (error) {
    console.error("Could not create candidate profile", error);
    return { error: "Could not create candidate profile. Please try again." };
  }
}
