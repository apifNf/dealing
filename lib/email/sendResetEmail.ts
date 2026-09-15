import fs from "fs/promises";
import path from "path";
import { Resend } from "resend";

const RESET_LOG_PATH = path.join(process.cwd(), "reset-links.log");

/**
 * Sends the password-reset email via Resend. Until RESEND_API_KEY is set
 * (see .env.local), falls back to logging the reset link to the console and
 * to reset-links.log, so the forgot-password flow stays fully testable
 * without a real email provider configured.
 */
export async function sendResetEmail(email: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const line = `[${new Date().toISOString()}] Password reset for ${email}: ${resetUrl}`;
    console.log(`[password-reset] RESEND_API_KEY not set, logging reset link instead of emailing.\n${line}`);
    try {
      await fs.appendFile(RESET_LOG_PATH, line + "\n");
    } catch (error) {
      console.error("[password-reset] failed to write reset-links.log:", error);
    }
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "DEALING <onboarding@resend.dev>",
    to: email,
    subject: "Reset Password DEALING",
    html: `
      <p>Kami menerima permintaan reset password untuk akun DEALING Anda.</p>
      <p><a href="${resetUrl}">Klik di sini untuk mengatur password baru</a> (berlaku 1 jam).</p>
      <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend failed to send reset email: ${error.message}`);
  }
}
