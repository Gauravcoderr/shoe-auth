import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyOtpState } from '@/lib/otp';
import { createSession } from '@/lib/session';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  const state = req.cookies.get('otp_state')?.value;

  if (!state) {
    return NextResponse.json({ detail: 'OTP expired or not requested' }, { status: 400 });
  }
  if (!verifyOtpState(state, email, otp)) {
    return NextResponse.json({ detail: 'Invalid or expired code' }, { status: 400 });
  }

  const user: User = {
    id: crypto.createHash('sha256').update(email).digest('hex').slice(0, 16),
    email,
    name: email.split('@')[0],
    phone: '',
    tier: 'free',
    checks_today: 0,
  };

  const session = createSession(user);
  const res = NextResponse.json({ user });
  res.cookies.set('session', session, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  res.cookies.delete('otp_state');
  return res;
}
