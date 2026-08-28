import { Metadata } from 'next';
import { auth } from '@/auth';
import AdminDashboard from './admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ANORENT — Studio Cockpit & Admin Dashboard',
  description: 'ANORENT Studio Admin Dashboard — CMS, Deployments, Inquiries & Settings',
};

export default async function HomePage() {
  const session = await auth();
  return <AdminDashboard sessionUser={session?.user} />;
}
