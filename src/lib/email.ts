import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

function fileLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ""}\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), "email-debug.log"), logMessage);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

fileLog("Email module initialized. API Key present: " + !!resendApiKey);
fileLog("From Address: " + emailFrom);

const resend = resendApiKey ? new Resend(resendApiKey) : null;
if (!resend) fileLog("ERROR: Resend client NOT initialized!");

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
    fileLog("WARNING: RESEND_API_KEY is not configured. Email would have been sent:", payload);
    return;
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    fileLog("Resend response:", result);
    
    if (result.error) {
      fileLog("ERROR: Resend API returned an error:", result.error);
    } else {
      fileLog("Resend successfully accepted the email. ID: " + result.data?.id);
    }
  } catch (error) {
    fileLog("CRITICAL ERROR: Failed to send email via Resend (thrown):", error);
    throw error;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  fileLog("Triggered: sendVerificationEmail to " + email);
  const verificationUrl = `${getAppBaseUrl()}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your email address - ShikshaFinder",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">Verify your account</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
          Thank you for signing up for <strong>ShikshaFinder</strong>. Please click the button below to verify your email address and activate your account.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          If the button above doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">
          ${verificationUrl}
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} ShikshaFinder. All rights reserved.
        </p>
      </div>
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
