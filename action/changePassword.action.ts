"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { error } from "console";
import { headers } from "next/headers";

export default async function changePasswordAction(formdata: FormData) {
  try {
    const currentPassword = String(formdata.get("currentPassword"));
    if (!currentPassword) {
      return { error: "enter your current password" };
    }

    const newPassword = String(formdata.get("newPassword"));
    if (!newPassword) {
      return { error: "enter new password" };
    }

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
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
