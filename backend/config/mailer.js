import nodemailer from "nodemailer";
import { getOtpEmailHtml } from "@/backend/utils/emailTemplates";

function getTransportConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  };
}

export async function sendOtpEmail({ to, name, otp }) {
  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP settings are required to send OTP email.");
    }

    console.log(`OTP for ${to}: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Your OTP Verification Code",
    text: `Hi ${name},\n\nYour verification OTP is ${otp}. It expires in 5 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
    html: getOtpEmailHtml(name, otp),
  });
}

export async function sendProductStatusEmail({ to, name, productName, status }) {
  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP settings are required to send product status email.");
    }
    console.log(`Product status email for ${to}: Product ${productName} is ${status}`);
    return;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const subject = status === "approved" ? "Product Approved" : "Product Rejected";
  const actionText = status === "approved" ? "is approved" : "has been rejected";

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: `Hi ${name},\n\nYour product ${productName} ${actionText}.\n\nThank you,\nAdministration Team`,
  });
}
