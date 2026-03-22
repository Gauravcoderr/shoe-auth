import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, signOtpState } from '@/lib/otp';
import { sendMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ detail: 'Email required' }, { status: 400 });

  const otp = generateOtp();
  const state = signOtpState(email, otp);

  await sendMail({
    to: email,
    subject: 'Your SneakerAuth sign-in code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
        <h2 style="color:#111;margin:0 0 8px">Your sign-in code</h2>
        <p style="color:#555;margin:0 0 24px">Use this code to sign in to SneakerAuth. It expires in 10 minutes.</p>
        <div style="font-size:42px;font-weight:700;letter-spacing:10px;color:#111;padding:20px 0;border-top:2px solid #f0f0f0;border-bottom:2px solid #f0f0f0;margin-bottom:24px">${otp}</div>
        <p style="color:#999;font-size:13px;margin:0">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set('otp_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return res;
}
