import crypto from 'crypto';
import { User } from '@/types';

const secret = () =>
  process.env.OTP_SECRET || process.env.BREVO_API_KEY || 'dev-secret-change-me';

export function createSession(user: User): string {
  const payload = JSON.stringify({ ...user, iat: Date.now() });
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ payload, sig })).toString('base64');
}

export function readSession(token: string): User | null {
  try {
    const { payload, sig } = JSON.parse(Buffer.from(token, 'base64').toString());
    const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
    if (sig !== expected) return null;
    return JSON.parse(payload) as User;
  } catch {
    return null;
  }
}
