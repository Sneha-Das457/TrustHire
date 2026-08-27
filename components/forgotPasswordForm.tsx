"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/auth-client";

export default function forgetPassword() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    if (!email) {
      return toast.error("Please provide your email");
    }

    await requestPasswordReset({
      email,
      redirectTo: "",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },

        onResponse: () => {
          setIsPending(false);
        },

        onError: (ctx) => {
          toast.error(ctx.error.message);
        },

        onSuccess: () => {
          toast.success("Password reset link sent to your email");
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <Button type="submit" disabled={isPending}>
        Send reset link
      </Button>
    </form>
  );
}

