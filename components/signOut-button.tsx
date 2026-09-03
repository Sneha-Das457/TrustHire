"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

export default function signOutButton() {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleClick() {
    await signOut({
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
          toast.success("Sign out successfully");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button onClick={handleClick} variant="destructive" disabled={isPending}>
      Sign Out
    </Button>
  );
}
