"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface candidateEducationProps {
    institution : string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    isCurrent: string;
    
}