import { Metadata } from 'next';
import { auth } from '@/auth';
import AdminDashboard from '../AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Deployments Manager — ANORENT Studio CMS',
  description: 'Manage production artifacts and deployments',
  robots: 'noindex, nofollow',
};

export default async function AdminDeploymentsPage() {
  const session = await auth();
  return <AdminDashboard sessionUser={session?.user} />;
}
