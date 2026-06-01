import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="py-20 animate-fade-in">
      <div className="mx-auto max-w-md px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-center text-ocean-900">
          Admin & Staff Login
        </h1>
        <p className="mt-2 text-center text-ocean-600">
          Access your dashboard to manage products and orders.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
