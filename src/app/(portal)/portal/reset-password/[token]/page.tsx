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
      title="Choose a fresh password for the portal."
      description="This link is time-limited and single-use. Once the password changes, existing sessions are removed automatically."
      footer={
        <p className="text-sm text-slate-400">
          Need a new link?{" "}
          <Link href="/portal/forgot-password" className="text-brass transition hover:text-[#8bc6ca]">
            Request another reset email
          </Link>
        </p>
      }
    >
      {activeToken ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          This password reset link is invalid or has expired.
        </div>
      )}
    </AuthShell>
  );
}
