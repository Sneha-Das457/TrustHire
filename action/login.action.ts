"use server";

import { APIError } from "better-auth";
import { auth } from "@/lib/auth";
import { error } from "console";

interface loginActionProps {
  email: string;
  password: string;
}

export default async function loginAction({
  email,
  password,
}: loginActionProps) {
  try {
    if (!email || !password) {
      return { error: "Email and Password are required" };
    }

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }

    return { error: String(error) };
  }
}
