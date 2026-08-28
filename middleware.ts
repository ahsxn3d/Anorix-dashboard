import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTHORIZED_EMAIL } from '@/lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets and auth API
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Check custom secure session cookie if set via direct OAuth
  const customSession = request.cookies.get('anorent_session_user')?.value;
  let customEmail: string | null = null;
  if (customSession) {
    try {
      const parsed = JSON.parse(customSession);
      customEmail = parsed?.email || null;
    } catch {
      customEmail = null;
    }
  }

  // 3. If a non-whitelisted user email is present, block
  if (customEmail && customEmail.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'AccessDenied');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
