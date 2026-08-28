import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const AUTHORIZED_EMAIL = 'muhammadahsanjaved09@gmail.com';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // 1. Extended Persistent Session (Stay Logged In for 1 Year)
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60, // 1 year (31,536,000 seconds)
  },

  // 2. Custom Auth Pages
  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    // 3. Strict Whitelist & Database Upsert on Sign In
    async signIn({ user }) {
      if (!user.email || user.email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
        console.warn(`[AUTH ACCESS DENIED]: Unauthorized login attempt from ${user.email}`);
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email: AUTHORIZED_EMAIL },
          update: {
            avatarUrl: user.image || undefined,
          },
          create: {
            id: 'superadmin-user',
            email: AUTHORIZED_EMAIL,
            name: user.name || 'Ahsan',
            role: 'SUPERADMIN',
            avatarUrl: user.image || undefined,
          },
        });
      } catch (error) {
        console.error('[AUTH DB UPSERT ERROR]:', error);
      }

      return true;
    },

    // 4. Populate JWT Token with Real-Time Database Profile Data
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      // Query latest profile name and role from database on each verification check
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: AUTHORIZED_EMAIL },
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
          if (dbUser.avatarUrl) {
            token.picture = dbUser.avatarUrl;
          }
        } else {
          token.role = 'SUPERADMIN';
        }
      } catch (error) {
        console.warn('[AUTH JWT DB LOOKUP ERROR]:', error);
        token.role = 'SUPERADMIN';
      }

      return token;
    },

    // 5. Pass Authenticated Session Details to Client
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        (session.user as { role?: string }).role = (token.role as string) || 'SUPERADMIN';
      }
      return session;
    },
  },
});
