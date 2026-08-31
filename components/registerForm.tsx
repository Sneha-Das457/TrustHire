"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import registerAction from "@/action/register.action";
import {
  AuthHeading,
  Field,
  InlineBanner,
  PasswordField,
  PasswordRequirements,
  PrimaryButton,
} from "@/components/auth-ui";
const validPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);
export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
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
    setIsPending(true);
    try {
      const result = await registerAction({ name, email, password });
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Registration successful");
        e.currentTarget.reset();
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
      }
    } finally {
      setIsPending(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      <AuthHeading
        title="Create your account"
        description="Join TrustHire to start hiring or getting hired through trusted referrals."
      />
      {error && <InlineBanner>{error}</InlineBanner>}
      <div className="space-y-5 pt-3">
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
        />
        <div onFocus={() => setPasswordFocused(true)}>
          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
          />
          <PasswordRequirements password={password} visible={passwordFocused} />
        </div>
        <PasswordField
          label="Confirm password"
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
      <p className="text-xs leading-5 text-slate-400">
        Your password is encrypted and never shared. By creating an account, you
        agree to our{" "}
        <Link href="#" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <PrimaryButton
        type="submit"
        pending={isPending}
        pendingText="Creating account…"
      >
        Create account
      </PrimaryButton>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
