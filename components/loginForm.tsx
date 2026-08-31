"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import loginAction from "@/action/login.action";
import {
  AuthHeading,
  Field,
  InlineBanner,
  PasswordField,
  PrimaryButton,
} from "@/components/auth-ui";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const result = await loginAction({ email, password });
      if (result.error) {
        setError("Incorrect email or password. Please try again.");
        toast.error(result.error);
      } else toast.success("Login successful");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      <AuthHeading
        title="Welcome back"
        description="Sign in to continue to your TrustHire workspace."
      />
      {error && <InlineBanner>{error}</InlineBanner>}
      <div className="space-y-5 pt-3">
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
          disabled={isPending}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          disabled={isPending}
        />
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
            disabled={isPending}
          />
          Remember me
        </label>
        <Link
          href="/auth/forgotPassword"
          className="font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <PrimaryButton
        type="submit"
        pending={isPending}
        pendingText="Signing in…"
      >
        Sign in
      </PrimaryButton>
      <p className="pt-1 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
