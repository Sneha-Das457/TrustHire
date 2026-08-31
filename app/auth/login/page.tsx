import LoginForm from "@/components/loginForm";
import AuthLayout from "@/components/auth-layout";

export default function logInPage(){
    return <AuthLayout supportingText="Sign in to manage your hiring pipeline, referrals, and applications in one place."><LoginForm /></AuthLayout>
}
