"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import { AuthHeading, Field, PrimaryButton, SuccessPanel } from "@/components/auth-ui";
export default function ForgetPasswordForm() {
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [isPending, setIsPending] = useState(false); const [sent, setSent] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email address."); return; } await requestPasswordReset({ email, redirectTo: "", fetchOptions: { onRequest: () => setIsPending(true), onResponse: () => setIsPending(false), onError: ctx => setError(ctx.error.message), onSuccess: () => setSent(true) } }); }
  if (sent) return <SuccessPanel title="Check your email"><p>We&apos;ve sent password reset instructions to <span className="font-medium text-slate-700">{email}</span>.</p><p className="mt-3">Didn&apos;t get the email? Check your spam folder, then try again.</p><Link href="/auth/login" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />Back to login</Link></SuccessPanel>;
  return <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate><Link href="/auth/login" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary"><ArrowLeft className="size-4" />Back to login</Link><AuthHeading title="Reset your password" description="Enter the email associated with your account and we’ll send you a link to reset your password." /><Field label="Email" type="email" name="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} error={error} disabled={isPending} required /><PrimaryButton type="submit" pending={isPending} pendingText="Sending link…">Send reset link</PrimaryButton></form>;
}
