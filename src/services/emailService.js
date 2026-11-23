import transporter from "../config/mail.js";

export const sendEmail = async ({ to, subject, html }) => {
  console.log(`📧 Attempting to send email to: ${to} (Subject: "${subject}")`);

  const senderEmail = process.env.EMAIL_USER;
  const senderName = process.env.EMAIL_FROM_NAME || process.env.BREVO_SENDER_NAME || "Job Portal";

  if (!senderEmail || !process.env.EMAIL_PASS) {
    const errorMsg = "Gmail credentials (EMAIL_USER and EMAIL_PASS) are not configured in environment variables.";
    console.error("Email configuration error:", errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully via Gmail:", info.messageId);
    return info;
  } catch (error) {
    console.error("Gmail email delivery error:", error?.message || error);
    throw error;
  }
};
