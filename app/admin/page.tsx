import { Metadata } from 'next';
import { auth } from '@/auth';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard — ANORENT Studio CMS',
  description: 'ANORENT Studio Admin Dashboard — CMS, Deployments, Inquiries & Settings',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const session = await auth();
  return <AdminDashboard sessionUser={session?.user} />;
}
