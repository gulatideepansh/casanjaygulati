import nodemailer from "nodemailer";

type PasswordResetPayload = {
  displayName: string;
  email: string;
  resetUrl: string;
};

type MailResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: "SMTP_NOT_CONFIGURED";
    };

let transporter: nodemailer.Transporter | null | undefined;

function getTransporter() {
  if (transporter !== undefined) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  return transporter;
}

export async function sendPasswordResetEmail({
  displayName,
  email,
  resetUrl
}: PasswordResetPayload): Promise<MailResult> {
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    return {
      ok: false,
      reason: "SMTP_NOT_CONFIGURED"
    };
  }

  await activeTransporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@casanjaygulati.in",
    to: email,
    subject: "Reset your portal password",
    text: `Hello ${displayName},\n\nUse this secure link to reset your password:\n${resetUrl}\n\nThis link expires in 30 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <p>Hello ${displayName},</p>
        <p>Use the secure button below to reset your portal password. The link expires in 30 minutes.</p>
        <p>
          <a
            href="${resetUrl}"
            style="display: inline-block; padding: 12px 20px; border-radius: 999px; background: #6aa7ac; color: #07131c; font-weight: 700; text-decoration: none;"
          >
            Reset password
          </a>
        </p>
        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `
  });

  return {
    ok: true
  };
}
