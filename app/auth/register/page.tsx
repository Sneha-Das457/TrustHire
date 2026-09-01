import RegisterForm from "@/components/registerForm";
import AuthLayout from "@/components/auth-layout";

export default function registerPage() {
  return (
    <AuthLayout supportingText="Join a hiring network built around people who know the work.">
      <RegisterForm />
    </AuthLayout>
  );
}
