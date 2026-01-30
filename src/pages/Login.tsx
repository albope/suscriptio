import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

// Icons
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      // Map Supabase error codes to user-friendly messages
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid_credentials')
      ) {
        setError(t('auth.errors.invalidCredentials'));
      } else if (errorMessage.includes('email not confirmed')) {
        setError(t('auth.errors.emailNotConfirmed'));
      } else if (
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate limit')
      ) {
        setError(t('auth.errors.tooManyRequests'));
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError(t('auth.errors.networkError'));
      } else if (errorMessage.includes('user not found')) {
        setError(t('auth.errors.userNotFound'));
      } else {
        // Fallback to generic error
        setError(t('auth.errors.invalidCredentials'));
      }

      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 212, 255, 0.12), transparent),
          radial-gradient(ellipse 60% 40% at 80% 0%, rgba(168, 85, 247, 0.08), transparent),
          radial-gradient(ellipse 40% 30% at 20% 100%, rgba(0, 212, 255, 0.06), transparent)
        `,
          pointerEvents: 'none',
        }}
      />

      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* Floating Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo Section - Centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '48px',
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            {/* Logo Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            />
            <img
              src="/logo.png"
              alt="Suscriptio"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
              }}
            />
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Suscriptio
          </h1>
          <p
            style={{
              color: '#666666',
              fontSize: '15px',
              fontWeight: 400,
            }}
          >
            {t('auth.login')}
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background:
              'linear-gradient(145deg, rgba(17, 17, 17, 0.9) 0%, rgba(17, 17, 17, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.03) inset,
              0 20px 50px -10px rgba(0, 0, 0, 0.5),
              0 0 80px -20px rgba(0, 212, 255, 0.1)
            `,
            animation: 'slideUp 0.5s ease-out 0.1s backwards',
          }}
        >
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 68, 68, 0.08)',
                border: '1px solid rgba(255, 68, 68, 0.15)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ff6b6b',
                  boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
                }}
              />
              <span style={{ color: '#ff8a8a', fontSize: '14px', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: focusedField === 'email' ? '#00d4ff' : '#888888',
                marginBottom: '10px',
                transition: 'color 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              {t('auth.email')}
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: focusedField === 'email' ? '#00d4ff' : '#555555',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MailIcon />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  border:
                    focusedField === 'email'
                      ? '1px solid rgba(0, 212, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#ededed',
                  backgroundColor:
                    focusedField === 'email' ? 'rgba(0, 212, 255, 0.03)' : 'rgba(0, 0, 0, 0.3)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow:
                    focusedField === 'email'
                      ? '0 0 0 4px rgba(0, 212, 255, 0.08), 0 0 20px rgba(0, 212, 255, 0.1)'
                      : 'none',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: focusedField === 'password' ? '#00d4ff' : '#888888',
                marginBottom: '10px',
                transition: 'color 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              {t('auth.password')}
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: focusedField === 'password' ? '#00d4ff' : '#555555',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LockIcon />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  border:
                    focusedField === 'password'
                      ? '1px solid rgba(0, 212, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#ededed',
                  backgroundColor:
                    focusedField === 'password' ? 'rgba(0, 212, 255, 0.03)' : 'rgba(0, 0, 0, 0.3)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow:
                    focusedField === 'password'
                      ? '0 0 0 4px rgba(0, 212, 255, 0.08), 0 0 20px rgba(0, 212, 255, 0.1)'
                      : 'none',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: loading
                ? 'rgba(255, 255, 255, 0.05)'
                : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 50%, #0090b0 100%)',
              color: loading ? '#555555' : '#000',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading
                ? 'none'
                : `
                  0 0 0 1px rgba(0, 212, 255, 0.3),
                  0 4px 20px rgba(0, 212, 255, 0.25),
                  0 8px 40px -10px rgba(0, 212, 255, 0.4)
                `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  0 0 0 1px rgba(0, 212, 255, 0.5),
                  0 8px 30px rgba(0, 212, 255, 0.35),
                  0 12px 50px -10px rgba(0, 212, 255, 0.5)
                `;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  0 0 0 1px rgba(0, 212, 255, 0.3),
                  0 4px 20px rgba(0, 212, 255, 0.25),
                  0 8px 40px -10px rgba(0, 212, 255, 0.4)
                `;
              }
            }}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>{t('auth.login')}</span>
                <ArrowIcon />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '28px',
            color: '#555555',
            fontSize: '14px',
            animation: 'fadeIn 0.6s ease-out 0.3s backwards',
          }}
        >
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = '#00d4ff';
              e.currentTarget.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #444444;
        }
      `}</style>
    </div>
  );
};
