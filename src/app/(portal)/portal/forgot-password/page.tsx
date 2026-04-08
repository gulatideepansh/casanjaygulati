import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/portal/auth-shell";
import { ForgotPasswordForm } from "@/components/portal/forgot-password-form";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Forgot Password | Casanjaygulati"
};

export default async function ForgotPasswordPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/portal/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Password Recovery"
      title="Reset a portal account password."
      description="Enter the staff account email address. The portal will generate a time-limited reset link and email it through the configured SMTP service."
      footer={
        <p className="text-sm text-slate-400">
          Remembered your password?{" "}
          <Link href="/portal/sign-in" className="text-brass transition hover:text-[#8bc6ca]">
            Return to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
