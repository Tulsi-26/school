import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "Product Team <noreply@flavidairysolution.com>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function getAppBaseUrl() {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(payload: EmailPayload) {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not configured. Email would have been sent:",
      payload
    );
    return;
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  } catch (error) {
    console.error("[email] Failed to send email via Resend:", {
      payload,
      error,
    });
    throw error;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getAppBaseUrl()}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Verify your account</h2>
      <p>Click the button below to verify your email.</p>
      <p><a href="${verificationUrl}">Verify email</a></p>
      <p>If the button above does not work, copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getAppBaseUrl()}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>
      <p>We received a request to reset the password on your account.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>${resetUrl}</p>
    `,
  });
}
export async function sendInvitationEmail(email: string, inviteLink: string, organizationName: string, role: string) {
  await sendEmail({
    to: email,
    subject: `Invitation to join ${organizationName} on ShikshaFinder`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">You've been invited!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
          You have been invited to join <strong>${organizationName}</strong> as a <strong>${role.toLowerCase()}</strong> on ShikshaFinder.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Accept Invitation</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          This invitation will expire in 7 days. If the button above doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">
          ${inviteLink}
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} ShikshaFinder. All rights reserved.
        </p>
      </div>
    `,
  });
}
