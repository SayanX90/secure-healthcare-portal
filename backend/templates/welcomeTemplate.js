export function welcomeTemplate(userName) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">Welcome to MEDENDRIYO HEALTHCARE PVT. LTD.</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Welcome to MEDENDRIYO HEALTHCARE PVT. LTD.</p>
      <p>Your profile has been successfully created and your account is now ready to use.</p>
      <p>You can now register products, submit service requests, and track support updates from your dashboard.</p>
      <p>Thank you for choosing MEDENDRIYO HEALTHCARE PVT. LTD.</p>
      <br>
      <p>Best Regards,<br><strong>MEDENDRIYO HEALTHCARE PVT. LTD. Team</strong></p>
    </div>
  `;
}
