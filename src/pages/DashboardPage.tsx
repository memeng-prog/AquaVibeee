import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { StaffDashboard } from '@/components/dashboard/StaffDashboard';
import { Navigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StaffDashboard userName={user.full_name} userEmail={user.email} />
        )}
      </div>
    </div>
  );
}
