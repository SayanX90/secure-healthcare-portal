import { transporter } from "../../utils/emailTransporter.js";
import { serviceRequestTemplate } from "../../templates/serviceRequestTemplate.js";

export const sendServiceRequestEmail = async (toEmail, userName, productName, createdDate) => {
  try {
    const { MAIL_FROM } = process.env;

    const htmlContent = serviceRequestTemplate(userName, productName, createdDate);

    const mailOptions = {
      from: MAIL_FROM || '"MEDENDRIYO HEALTHCARE PVT. LTD." <noreply@example.com>',
      to: toEmail,
      subject: "Service Request Submitted Successfully",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Service request email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send service request email to ${toEmail}:`, error);
  }
};
