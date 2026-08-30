"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface resetPasswordProps {
  token: string;
}

export default function resetPasswordForm({ token }: resetPasswordProps) {
  const [isPending, setIspending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const newPassword = String(formdata.get("newPassword"));
    if (!newPassword) {
      return toast.error("Enter new password");
    }

    const confirmPassword = String(formdata.get("confirmPassword"));
    if (confirmPassword !== newPassword) {
      return toast.error("Incorrect password");
    }

    await resetPassword({
      newPassword,
      token,
      fetchOptions: {
        onRequest: () => {
          setIspending(true);
        },
        onResponse: () => {
          setIspending(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Password reset successfully");
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input type="password" id="newPassword" name="newPassword" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Reset Password
      </Button>
    </form>
  );
}
