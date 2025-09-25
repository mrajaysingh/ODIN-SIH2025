import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const username = (searchParams.get('username') || '').trim();
    if (!username) return NextResponse.json({ available: false, message: 'username required' }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/auth/username-available?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return NextResponse.json({ available: Boolean(data?.available) });
  } catch (err) {
    return NextResponse.json({ available: false }, { status: 500 });
  }
}


