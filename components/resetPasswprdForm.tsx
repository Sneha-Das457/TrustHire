"use client";
import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "@/lib/auth-client";
import {
  AuthHeading,
  InlineBanner,
  PasswordField,
  PasswordRequirements,
  PrimaryButton,
  SuccessPanel,
} from "@/components/auth-ui";
interface ResetPasswordProps {
  token: string;
}
const validPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);
export default function ResetPasswordForm({ token }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [focused, setFocused] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [done, setDone] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!validPassword(password)) {
      setError("Choose a password that meets the requirements below.");
      return;
    }
    if (password !== confirm) {
      setConfirmError("Passwords don’t match");
      return;
    }
    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => setIsPending(false),
        onError: (ctx) => setError(ctx.error.message),
        onSuccess: () => setDone(true),
      },
    });
  }
  if (done)
    return (
      <SuccessPanel title="Password updated">
        <p>
          Your password has been changed successfully. You can now sign in with
          your new password.
        </p>
        <Link
          href="/auth/login"
          className="mt-7 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Go to login
        </Link>
      </SuccessPanel>
    );
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      <AuthHeading
        title="Set a new password"
        description="Choose a strong password you haven’t used before."
      />
      {error && <InlineBanner>{error}</InlineBanner>}
      <div className="space-y-5 pt-3">
        <div onFocus={() => setFocused(true)}>
          <PasswordField
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
          />
          <PasswordRequirements password={password} visible={focused} />
        </div>
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setConfirmError("");
          }}
          onBlur={() =>
            confirm &&
            password !== confirm &&
            setConfirmError("Passwords don’t match")
          }
          error={confirmError}
          required
          disabled={isPending}
        />
      </div>
      <PrimaryButton type="submit" pending={isPending} pendingText="Resetting…">
        Reset password
      </PrimaryButton>
      <p className="text-center text-sm text-slate-500">
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Return to login
        </Link>
      </p>
    </form>
  );
}
