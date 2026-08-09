
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Sending email to:", to);

    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Job Portal",
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],

      subject: subject,
      htmlContent: html,
    });

    console.log("Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw error;
  }
}
