import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const user = readSession(token);
  if (!user) return NextResponse.json({ detail: 'Invalid session' }, { status: 401 });

  return NextResponse.json(user);
}
