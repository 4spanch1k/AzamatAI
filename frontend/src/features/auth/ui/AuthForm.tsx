import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import { Button } from '@/shared/ui/Button';
import { ErrorAlert } from '@/shared/ui/ErrorAlert';
import { TextField } from '@/shared/ui/TextField';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const passwordStrong = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !confirmPassword)) {
      setError('Fill in the required fields before continuing.');
      return;
    }

    if (isRegister && !passwordStrong) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    if (isRegister && !passwordsMatch) {
      setError('Passwords must match before the account can be created.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }

      navigate('/dashboard');
    } catch {
      setError('The request failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isRegister ? 'Create account' : 'Sign in';
  const loadingLabel = isRegister ? 'Creating account' : 'Signing in';

  return (
    <div className={styles.formShell}>
      <div className={styles.header}>
        <span className={styles.kicker}>{isRegister ? 'Register' : 'Sign in'}</span>
        <h2>{isRegister ? 'Create your AzamatAI workspace' : 'Welcome back'}</h2>
        <p>
          {isRegister
            ? 'Set up a clean dashboard for document, eGov, loan, and job analysis.'
            : 'Open the dashboard and continue from the module you need.'}
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          autoComplete="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className={styles.passwordField} htmlFor={`${mode}-password`}>
          <span className={styles.passwordHeader}>
            <span>Password</span>
            {isRegister && (
              <small className={passwordStrong ? styles.strong : styles.weak}>
                {password ? (passwordStrong ? 'Strong enough' : 'Minimum 8 characters') : 'Minimum 8 characters'}
              </small>
            )}
          </span>
          <span className={styles.passwordControl}>
            <input
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className={styles.passwordInput}
              id={`${mode}-password`}
              placeholder={isRegister ? 'Create a password' : 'Enter your password'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className={styles.toggle}
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>

        {isRegister && (
          <TextField
            autoComplete="new-password"
            hint={confirmPassword ? (passwordsMatch ? 'Passwords match' : 'Needs to match') : undefined}
            label="Confirm password"
            placeholder="Repeat password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        )}

        <div className={styles.actions}>
          <Button disabled={isSubmitting} fullWidth type="submit">
            {isSubmitting && <LoaderCircle size={16} />}
            {isSubmitting ? `${loadingLabel}...` : submitLabel}
          </Button>

          {!isRegister && (
            <Button
              disabled={isSubmitting}
              fullWidth
              type="button"
              variant="secondary"
              onClick={async () => {
                setIsSubmitting(true);
                setError('');
                try {
                  await login('demo@azamatai.kz', 'demo');
                  navigate('/dashboard');
                } catch {
                  setError('Demo login failed. Try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Continue as demo user
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
