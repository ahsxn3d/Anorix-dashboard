import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AUTHORIZED_EMAIL } from '@/lib/constants';

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
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (error || !code) {
    console.error('[Google OAuth Error]:', error || 'No authorization code received');
    return NextResponse.redirect(`${baseUrl}/admin?auth_error=${encodeURIComponent(error || 'Authorization cancelled')}`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not configured');
    }

    // 1. Exchange authorization code for access & id tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google Token Exchange Error]:', tokenData);
      return NextResponse.redirect(`${baseUrl}/admin?auth_error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}`);
    }

    // 2. Fetch User Profile from Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userinfoResponse.json();

    if (!googleUser.email) {
      throw new Error('Failed to retrieve user email from Google');
    }

    const userEmail = googleUser.email;
    const userName = googleUser.name || 'Ahsan';
    const userAvatar = googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    // 3. Strict Whitelist Check
    if (userEmail.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      return NextResponse.redirect(
        `${baseUrl}/admin?auth_error=${encodeURIComponent('Access Denied: Only the authorized email (' + AUTHORIZED_EMAIL + ') is permitted to access the cockpit.')}`
      );
    }

    // 4. Upsert verified user in database with SUPERADMIN role
    try {
      await prisma.user.upsert({
        where: { email: AUTHORIZED_EMAIL },
        update: {
          name: userName,
          avatarUrl: userAvatar,
          role: 'SUPERADMIN',
        },
        create: {
          email: AUTHORIZED_EMAIL,
          name: userName,
          avatarUrl: userAvatar,
          role: 'SUPERADMIN',
        },
      });
    } catch (dbErr) {
      console.warn('[Prisma User Upsert Notice]:', dbErr);
    }

    // 5. Create redirect URL back to Admin cockpit with verified user details
    const successUrl = new URL(`${baseUrl}/admin`);
    successUrl.searchParams.set('auth_success', 'true');
    successUrl.searchParams.set('user_name', userName);
    successUrl.searchParams.set('user_email', AUTHORIZED_EMAIL);
    successUrl.searchParams.set('user_avatar', userAvatar);

    const response = NextResponse.redirect(successUrl.toString());

    // 6. Set 365-day persistent session cookie
    response.cookies.set(
      'anorent_session_user',
      JSON.stringify({ name: userName, email: AUTHORIZED_EMAIL, avatar: userAvatar }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      }
    );

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown OAuth error';
    console.error('[Google OAuth Callback Catch]:', errorMsg);
    return NextResponse.redirect(`${baseUrl}/admin?auth_error=${encodeURIComponent(errorMsg)}`);
  }
}
