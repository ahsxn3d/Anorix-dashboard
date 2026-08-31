import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahsan | Frontend Developer & 3D Artist',
  description: 'Bespoke cybernetic digital experiences, WebGL shaders, real-time escrow pipelines, and high-performance Next.js interfaces engineered for visionary founders.',
  keywords: ['Ahsan Javed', 'ANORIX', 'Frontend Developer', '3D Artist', 'WebGL', 'Next.js', 'Creative Developer', 'Dashboard'],
  authors: [{ name: 'Ahsan Javed' }],
  robots: 'noindex, nofollow', // Admin panel — don't index
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-icon.png' },
    ],
    shortcut: ['/favicon.ico'],
  },
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
