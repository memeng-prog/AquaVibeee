import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { StaffDashboard } from '@/components/dashboard/StaffDashboard';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {user ? (
          user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <StaffDashboard userName={user.full_name} userEmail={user.email} />
          )
        ) : (
          <div className="rounded-3xl border border-ocean-100 bg-ocean-50 p-10 text-center shadow-soft">
            <h1 className="font-display text-4xl font-bold text-ocean-900 mb-4">AquaVibe Dashboard</h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-ocean-600 mb-6">
              This page is publicly accessible, but admin and staff tools are only available after signing in.
            </p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-ocean-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800">
              Sign in to manage orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
