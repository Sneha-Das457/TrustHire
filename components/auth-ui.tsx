"use client";

import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AuthHeading({ title, description }: { title: string; description: string }) {
  return <div><h1 className="font-serif text-3xl font-medium tracking-tight text-[#0b1a33] sm:text-[32px]">{title}</h1><p className="mt-2 text-[15px] leading-6 text-slate-500">{description}</p></div>;
}

export function Field({ label, error, className, ...props }: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return <div className={cn("space-y-1.5", className)}><label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label><Input {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-11 rounded-md border-slate-200 bg-white px-3 text-[15px] shadow-sm focus-visible:border-primary focus-visible:ring-primary/20" />{error && <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-rose-700"><AlertCircle className="size-3.5" />{error}</p>}</div>;
}

export function PasswordField({ label, error, ...props }: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  const [visible, setVisible] = useState(false); const id = props.id ?? props.name;
  return <div className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label><div className="relative"><Input {...props} id={id} type={visible ? "text" : "password"} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-11 rounded-md border-slate-200 bg-white px-3 pr-11 text-[15px] shadow-sm focus-visible:border-primary focus-visible:ring-primary/20" /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>{error && <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-rose-700"><AlertCircle className="size-3.5" />{error}</p>}</div>;
}

export function PasswordRequirements({ password, visible }: { password: string; visible: boolean }) {
  if (!visible) return null;
  const requirements = [["At least 8 characters", password.length >= 8], ["One uppercase letter", /[A-Z]/.test(password)], ["One number", /\d/.test(password)], ["One special character", /[^A-Za-z0-9]/.test(password)]];
  return <ul className="space-y-1 pt-1" aria-label="Password requirements">{requirements.map(([label, met]) => <li key={label as string} className={cn("flex items-center gap-2 text-xs", met ? "text-teal-700" : "text-slate-400")}><span className={cn("grid size-3.5 place-items-center rounded-full border", met ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300")} >{met && <Check className="size-2.5" />}</span>{label as string}</li>)}</ul>;
}

export function PrimaryButton({ pending, children, pendingText, ...props }: React.ComponentProps<"button"> & { pending?: boolean; pendingText?: string }) {
  return <button {...props} disabled={pending || props.disabled} className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50", props.className)}>{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? pendingText : children}</button>;
}

export function InlineBanner({ children }: { children: React.ReactNode }) { return <div role="alert" className="flex items-start gap-2 rounded-md border-l-2 border-rose-500 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"><AlertCircle className="mt-0.5 size-4 shrink-0" />{children}</div>; }
export function SuccessPanel({ title, children }: { title: string; children: React.ReactNode }) { return <div className="w-full"><span className="grid size-11 place-items-center rounded-full bg-teal-50 text-teal-700"><CheckCircle2 className="size-6" /></span><h1 className="mt-5 font-serif text-3xl font-medium tracking-tight text-[#0b1a33]">{title}</h1><div className="mt-2 text-[15px] leading-6 text-slate-500">{children}</div></div>; }
