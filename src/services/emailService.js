import { BrevoClient } from "@getbrevo/brevo";
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  console.log(`📧 Attempting to send email to: ${to} (Subject: "${subject}")`);

  let lastError = null;

  // 1. First priority: Nodemailer (if EMAIL_USER and EMAIL_PASS are configured)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      console.log("Using Nodemailer (Gmail) for email delivery...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.BREVO_SENDER_NAME || 'Job Portal'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

      console.log("Email sent successfully via Nodemailer:", info.messageId);
      return info;
    } catch (nmError) {
      console.error("Nodemailer failed, falling back to Brevo:", nmError.message);
      lastError = nmError;
    }
  }

  // 2. Second priority: Brevo API
  if (process.env.BREVO_API_KEY) {
    try {
      console.log("Using Brevo for email delivery...");
      const brevo = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY,
      });

      const senderEmail = process.env.BREVO_SENDER_EMAIL || "niranjankasote2375@gmail.com";
      const senderName = process.env.BREVO_SENDER_NAME || "Job Portal";

      const response = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      });

      console.log("Email sent successfully via Brevo:", response);
      return response;
    } catch (brevoError) {
      console.error("Brevo Email Error details:", brevoError?.response?.data || brevoError?.message || brevoError);
      lastError = brevoError;
    }
  }

  // If both failed or none configured
  const errorMessage = lastError?.message || "No valid email service configured or active (check BREVO_API_KEY or EMAIL_USER/EMAIL_PASS)";
  console.error("Final email send failure:", errorMessage);
  throw new Error(errorMessage);
};
