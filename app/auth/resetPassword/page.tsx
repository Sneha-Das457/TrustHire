import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/resetPasswprdForm";
import AuthLayout from "@/components/auth-layout";

interface ResetPasswordFormProps {
  searchParams: Promise<{ token: string }>;
}

export default async function resetPasswordPage({
  searchParams,
}: ResetPasswordFormProps) {
  const token = (await searchParams).token;
  if (!token) redirect("/login");

  return (
    <AuthLayout supportingText="Choose a secure new password and get back to your hiring workspace.">
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
