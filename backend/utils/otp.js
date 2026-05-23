export function generateOtp() {
  // Generate 4 digit OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function createOtpExpiry() {
  // 2 minutes from now
  return new Date(Date.now() + 2 * 60 * 1000);
}
