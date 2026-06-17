export function serviceRequestTemplate(userName, productName, createdDate) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">Service Request Submitted Successfully</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your service request has been successfully submitted.</p>
      
      <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px;">Request Details:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Product Name:</strong> ${productName}</li>
        <li style="margin-bottom: 8px;"><strong>Request Date:</strong> ${createdDate}</li>
        <li style="margin-bottom: 8px;"><strong>Status:</strong> Pending</li>
      </ul>
      
      <p>Our service team will review your request and contact you if needed.</p>
      <p>You can track this request from: <strong>Dashboard → My Requests</strong></p>
      
      <p>Thank you for choosing MEDENDRIYO HEALTHCARE PVT. LTD.</p>
      <br>
      <p>Best Regards,<br><strong>MEDENDRIYO HEALTHCARE PVT. LTD. Team</strong></p>
    </div>
  `;
}
