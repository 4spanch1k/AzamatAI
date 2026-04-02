import { Navigate } from 'react-router';
import { useAuth } from '@/features/auth/model/AuthContext';
import { AuthForm } from '@/features/auth/ui/AuthForm';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm mode="register" />;
}
