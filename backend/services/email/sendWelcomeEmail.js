import { transporter } from "../../utils/emailTransporter.js";
import { welcomeTemplate } from "../../templates/welcomeTemplate.js";

export const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    const { MAIL_FROM } = process.env;

    const htmlContent = welcomeTemplate(userName);

    const mailOptions = {
      from: MAIL_FROM || '"MEDENDRIYO HEALTHCARE PVT. LTD." <noreply@example.com>',
      to: toEmail,
      subject: "Welcome to MEDENDRIYO HEALTHCARE PVT. LTD.",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Welcome email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send welcome email to ${toEmail}:`, error);
  }
};
