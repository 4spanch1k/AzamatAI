import { Navigate } from 'react-router';
import { useAuth } from '@/features/auth/model/AuthContext';
import { AuthForm } from '@/features/auth/ui/AuthForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm mode="login" />;
}
