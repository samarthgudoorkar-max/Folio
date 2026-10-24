import { NextRequest } from 'next/server';
import { DEMO_USERS } from './mock-data';
import { User } from './types';

export function getServerUser(request: NextRequest): User {
  const headerUserId = request.headers.get('x-user-id');
  const cookieUserId = request.cookies.get('folio_user_id')?.value;
  const targetId = headerUserId || cookieUserId;

  const found = DEMO_USERS.find(u => u.id === targetId);
  return found || DEMO_USERS[0];
}
