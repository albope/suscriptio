import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError(t('validation.invalidEmail'));
      return;
    }

    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('rate limit') || msg.includes('too many')) {
        setError(t('auth.errors.tooManyRequests'));
      } else {
        setError(t('auth.errors.resetFailed'));
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
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
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p style={{ color: '#666666', fontSize: '14px', lineHeight: '1.5' }}>
            {t('auth.forgotPasswordSubtitle')}
          </p>
        </div>

        {/* Form */}
        <div
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

          {success ? (
            <div
              style={{
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '10px',
                padding: '16px',
                color: '#00d4ff',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            >
              {t('auth.resetEmailSent')}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
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
                  background: loading
                    ? '#333333'
                    : 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
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
                {loading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            color: '#666666',
            fontSize: '14px',
          }}
        >
          <Link
            to="/login"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            {t('auth.backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
};
