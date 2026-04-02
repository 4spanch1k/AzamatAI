import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
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
  const { messages } = useLanguage();
  const isRegister = mode === 'register';
  const copy = isRegister ? messages.auth.register : messages.auth.login;

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
      setError(messages.auth.errors.required);
      return;
    }

    if (isRegister && !passwordStrong) {
      setError(messages.auth.errors.passwordLength);
      return;
    }

    if (isRegister && !passwordsMatch) {
      setError(messages.auth.errors.passwordMatch);
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
      setError(messages.auth.errors.requestFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = copy.submit;
  const loadingLabel = copy.loading;

  return (
    <div className={styles.formShell}>
      <div className={styles.header}>
        <span className={styles.kicker}>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      {error && <ErrorAlert message={error} />}

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          autoComplete="email"
          label={messages.auth.emailLabel}
          placeholder={messages.auth.emailPlaceholder}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className={styles.passwordField} htmlFor={`${mode}-password`}>
          <span className={styles.passwordHeader}>
            <span>{messages.auth.passwordLabel}</span>
            {isRegister && (
              <small className={passwordStrong ? styles.strong : styles.weak}>
                {password
                  ? passwordStrong
                    ? messages.auth.passwordHintStrong
                    : messages.auth.passwordHintWeak
                  : messages.auth.passwordHintIdle}
              </small>
            )}
          </span>
          <span className={styles.passwordControl}>
            <input
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className={styles.passwordInput}
              id={`${mode}-password`}
              placeholder={
                isRegister ? messages.auth.createPasswordPlaceholder : messages.auth.enterPasswordPlaceholder
              }
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
            hint={
              confirmPassword
                ? passwordsMatch
                  ? messages.auth.confirmHintMatch
                  : messages.auth.confirmHintMismatch
                : undefined
            }
            label={messages.auth.confirmPasswordLabel}
            placeholder={messages.auth.confirmPasswordPlaceholder}
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
                  setError(messages.auth.errors.demoFailed);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {messages.auth.login.demo}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
