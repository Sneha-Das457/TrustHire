import ForgetPasswordForm from "@/components/forgotPasswordForm";
import AuthLayout from "@/components/auth-layout";

export default function forgotPasswordPage() {
  return (
    <AuthLayout supportingText="We’ll help you get back into your account securely.">
      <ForgetPasswordForm />
    </AuthLayout>
  );
}
