import { transporter } from "../../utils/emailTransporter.js";
import { productRegistrationTemplate } from "../../templates/productRegistrationTemplate.js";

export const sendProductRegistrationEmail = async (toEmail, userName, productName, modelNumber, serialNumber) => {
  try {
    const { MAIL_FROM } = process.env;

    const htmlContent = productRegistrationTemplate(userName, productName, modelNumber, serialNumber);

    const mailOptions = {
      from: MAIL_FROM || '"MEDENDRIYO HEALTHCARE PVT. LTD." <noreply@example.com>',
      to: toEmail,
      subject: "Product Registration Submitted Successfully",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Product registration email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send product registration email to ${toEmail}:`, error);
  }
};
