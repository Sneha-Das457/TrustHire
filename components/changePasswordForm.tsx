"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "better-auth/api";
import { useState } from "react";
import { toast } from "sonner";
import changePasswordAction from "@/action/changePassword.action";

export default function changePasswordForm(
  e: React.FormEvent<HTMLFormElement>,
) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const { error } = await changePasswordAction(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Password Changed successfully");
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input type="password" id="currentPassword" name="currentPassword" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input type="password" id="newPassword" name="newPassword" />
      </div>

      <Button type="submit" disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
}

