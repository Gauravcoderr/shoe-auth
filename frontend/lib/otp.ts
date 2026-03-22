import crypto from 'crypto';

const secret = () =>
  process.env.OTP_SECRET || process.env.BREVO_API_KEY || 'dev-secret-change-me';

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function signOtpState(email: string, otp: string): string {
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = JSON.stringify({ email, otp, exp });
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ payload, sig })).toString('base64');
}

export function verifyOtpState(token: string, email: string, otp: string): boolean {
  try {
    const { payload, sig } = JSON.parse(Buffer.from(token, 'base64').toString());
    const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
    if (sig !== expected) return false;
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return false;
    return data.email === email && data.otp === otp;
  } catch {
    return false;
  }
}
