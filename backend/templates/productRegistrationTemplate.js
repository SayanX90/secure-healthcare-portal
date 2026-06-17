export function productRegistrationTemplate(userName, productName, modelNumber, serialNumber) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">Product Registration Submitted Successfully</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your product registration has been submitted successfully.</p>
      
      <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px;">Product Details:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Product Name:</strong> ${productName}</li>
        <li style="margin-bottom: 8px;"><strong>Model:</strong> ${modelNumber}</li>
        <li style="margin-bottom: 8px;"><strong>Serial Number:</strong> ${serialNumber}</li>
      </ul>
      
      <p><strong>Current Status:</strong> Pending Approval</p>
      <p>Our team will review your registration shortly.</p>
      <p>Thank you for choosing MEDENDRIYO HEALTHCARE PVT. LTD.</p>
      <br>
      <p>Best Regards,<br><strong>MEDENDRIYO HEALTHCARE PVT. LTD. Team</strong></p>
    </div>
  `;
}
