import { redirect } from "next/navigation";

import { SignInForm } from "@/components/portal/sign-in-form";
import { AuthShell } from "@/components/portal/auth-shell";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Portal Sign In | Casanjaygulati"
};

export default async function SignInPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/portal/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Secure Sign In"
      title="Access the staff portal with your account."
      description="Use your username or email address plus password to enter the internal portal. Staff accounts are created directly by the admin."
    >
      <SignInForm />
    </AuthShell>
  );
}
