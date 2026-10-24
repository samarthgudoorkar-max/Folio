import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const userIdCookie = request.cookies.get('folio_user_id')?.value;
  const user = DEMO_USERS.find(u => u.id === userIdCookie) || DEMO_USERS[0];

  return NextResponse.json({
    user,
    allDemoUsers: DEMO_USERS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    const targetUser = DEMO_USERS.find(u => u.id === userId);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({ user: targetUser });
    response.cookies.set('folio_user_id', targetUser.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to switch user' }, { status: 500 });
  }
}
