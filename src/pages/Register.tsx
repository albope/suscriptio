import { useState, FormEvent, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword, validateEmail } from '@/utils/validation';

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email format
    if (!validateEmail(email)) {
      setError(t('validation.invalidEmail'));
      return;
    }

    // Validate password strength
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.map((err) => t(err)).join('. '));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    const { error, data } = await signUp(email, password);

    if (error) {
      if (error.message.includes('already registered')) {
        setError(t('auth.errors.emailInUse'));
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else if (data?.user?.identities?.length === 0) {
      // Email already exists
      setError(t('auth.errors.emailInUse'));
      setLoading(false);
    } else if (data?.user && !data?.session) {
      // User created but needs email confirmation
      setSuccess(t('auth.confirmEmail'));
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#ededed',
    backgroundColor: '#0a0a0a',
    outline: 'none',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#000000',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img
            src="/logo.png"
            alt="Suscriptio"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              marginBottom: '16px',
            }}
          />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '8px',
            }}
          >
            Suscriptio
          </h1>
          <p style={{ color: '#666666', fontSize: '14px' }}>{t('auth.register')}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          {error && (
            <div
              style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#ff6b6b',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#00d4ff',
                fontSize: '14px',
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#888888',
                marginBottom: '8px',
              }}
            >
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#888888',
                marginBottom: '8px',
              }}
            >
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {/* Password strength indicator */}
            {password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width:
                          passwordValidation.strength === 'strong'
                            ? '100%'
                            : passwordValidation.strength === 'medium'
                              ? '66%'
                              : '33%',
                        height: '100%',
                        background: getStrengthColor(passwordValidation.strength),
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: getStrengthColor(passwordValidation.strength),
                    }}
                  >
                    {t(`validation.password.${passwordValidation.strength}`)}
                  </span>
                </div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px 12px',
                  }}
                >
                  {[
                    { key: 'minLength', check: password.length >= 8 },
                    { key: 'uppercase', check: /[A-Z]/.test(password) },
                    { key: 'lowercase', check: /[a-z]/.test(password) },
                    { key: 'number', check: /[0-9]/.test(password) },
                  ].map(({ key, check }) => (
                    <li
                      key={key}
                      style={{
                        fontSize: '11px',
                        color: check ? '#22c55e' : '#666666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{check ? '✓' : '○'}</span>
                      {t(`validation.password.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#888888',
                marginBottom: '8px',
              }}
            >
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: loading ? '#333333' : 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
              color: loading ? '#666666' : '#000',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            {loading ? '...' : t('auth.register')}
          </button>
        </form>

        {/* Login link */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            color: '#666666',
            fontSize: '14px',
          }}
        >
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};
