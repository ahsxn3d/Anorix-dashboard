import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANORIX — Digital Artist & Developer Studio',
  description: 'Bespoke cybernetic digital systems, real-time escrow pipelines, and synchronized Next.js 16 CMS architecture. ANORIX Studio Admin Dashboard.',
  keywords: ['ANORIX', 'digital artist', 'developer studio', 'Next.js', 'CMS', 'admin dashboard'],
  authors: [{ name: 'Ahsan Javed' }],
  robots: 'noindex, nofollow', // Admin panel — don't index
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
