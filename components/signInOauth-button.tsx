"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface signInOAuthProps {
  provider: "google" | "github";
  signUp: boolean;
}

export default function signInOAuthButton({
  provider,
  signUp,
}: signInOAuthProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: "",
      errorCallbackURL: "/auth/login",
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
      },
    });
  }

  const action = signUp ? "Sign up" : "Sign in";
  const providerName = provider === "google" ? "Google" : "Github";

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      {action} with {providerName}
    </Button>
  );
}
