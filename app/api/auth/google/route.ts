import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getBaseUrl(request: NextRequest): string {
  // 1. Dynamic header detection (Vercel / Cloudflare / Custom Domain)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  if (host && !host.includes('localhost:')) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
  }

  // 2. Vercel deployment environment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Environment configuration
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost:3000')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost:3000')) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  }

  // 4. Request URL origin
  try {
    const origin = new URL(request.url).origin;
    if (origin && !origin.includes('0.0.0.0')) return origin;
  } catch {
    // fallback below
  }

  return 'http://localhost:3000';
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is not configured in .env / .env.local' },
      { status: 500 }
    );
  }

  // Construct Google OAuth 2.0 authorization URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}
