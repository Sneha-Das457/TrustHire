"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

interface UpdateCandidateActionProps {
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

    const headline = data.headline.trim();
    const location = data.location.trim();
    const resumeUrl = data.resumeUrl.trim();

    if (!headline || !location || !resumeUrl) {
      return { error: "Headline, location, and resume are required" };
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

    await prisma.candidate.update({
      where: { id: candidateProfile.id },
      data: {
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
    });

    return { error: null };
  } catch (error) {
    console.error("Could not update candidate profile", error);
    return { error: "Could not update candidate profile. Please try again." };
  }
}
