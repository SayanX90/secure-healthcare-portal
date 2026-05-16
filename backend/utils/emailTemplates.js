export function getOtpEmailHtml(name, otp) {
  const currentYear = new Date().getFullYear();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f3f4f6" style="background-color: #f3f4f6; width: 100%; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        
        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; border-top: 5px solid #059669; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 32px 24px 32px; border-bottom: 1px solid #f3f4f6;">
              <span style="color: #059669; font-size: 26px; font-weight: bold; letter-spacing: -0.5px;">Home Healthcare</span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 40px 32px; color: #374151; line-height: 1.6; font-size: 16px;">
              <p style="margin: 0 0 16px 0; color: #111827; font-weight: 600; font-size: 18px;">Hello ${name},</p>
              <p style="margin: 0 0 32px 0;">We received a request to verify your identity. Please use the secure verification code below to proceed.</p>
              
              <!-- OTP Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 28px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
                    <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #065f46; font-family: 'Courier New', Courier, monospace;">${otp}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">This code is valid for the next <strong>5 minutes</strong>. For your security, please do not share this code with anyone.</p>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">If you did not initiate this request, please disregard this email.</p>
            </td>
          </tr>
          
        </table>
        
        <!-- Footer -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 520px;">
          <tr>
            <td align="center" style="padding: 24px 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">&copy; ${currentYear} Home Healthcare Services. All rights reserved.</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
