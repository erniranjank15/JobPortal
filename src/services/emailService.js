import transporter from "../config/mail.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("To:", to);

    const info = await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(info.messageId);
  } catch (error) {
    console.error("Email Error:", error);
  }
};