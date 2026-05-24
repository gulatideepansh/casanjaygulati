import Link from "next/link";

import { AuthShell } from "@/components/portal/auth-shell";
import { ResetPasswordForm } from "@/components/portal/reset-password-form";
import { sha256 } from "@/lib/auth/crypto";
import { getDb } from "@/lib/db";

export const metadata = {
  title: "Reset Password | Casanjaygulati"
};

type ResetPasswordPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  const tokenHash = sha256(token);

  const activeToken = await getDb().passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  return (
    <AuthShell
      eyebrow="Secure Reset"
      title="Choose a new password"
      description="Use this form before the reset link expires."
      footer={
        <p className="text-sm text-slate-600">
          Need a new link?{" "}
          <Link href="/portal/forgot-password" className="font-medium text-ink transition-colors hover:text-brass">
            Request another reset email
          </Link>
        </p>
      }
    >
      {activeToken ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          This password reset link is invalid or has expired.
        </div>
      )}
    </AuthShell>
  );
}
