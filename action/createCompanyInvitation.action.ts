"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { generateInvitationToken } from "@/lib/employee/generateInvitationToken";
import { headers } from "next/headers";
import { createHash } from "node:crypto";

interface CompanyInvitationProps {
  companyId: string;
  companyMemberId: string;
}

export default async function createCompanyInvitationAction({
  companyId,
  companyMemberId,
}: CompanyInvitationProps) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { error: "unauthorized" };
    }

    const admin = await prisma.companyMember.findFirst({
      where: {
        userId: session.user.id,
        companyId,
        role: "COMPANY_ADMIN",
      },
    });

    if (!admin) {
      return { error: "unauthorized" };
    }

    const companyMember = await prisma.companyMember.findFirst({
      where: { id: companyMemberId, companyId },
      select: { companyId: true },
    });

    if (!companyMember) {
      return { error: "Company member not found" };
    }

    const existingInvitation = await prisma.companyInvitation.findFirst({
      where: {
        companyId,
        companyMemberId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return { error: "Invitation already exists" };
    }

    const token = generateInvitationToken();

    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.companyInvitation.create({
      data: {
        companyId,
        companyMemberId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
