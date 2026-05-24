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
      title="Staff portal sign in"
      description="Use your username or email address and password to continue."
    >
      <SignInForm />
    </AuthShell>
  );
}
