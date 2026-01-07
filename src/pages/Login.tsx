import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(t('auth.errors.invalidCredentials'));
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#000000',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
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
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ededed',
            marginBottom: '8px',
          }}>
            Suscriptio
          </h1>
          <p style={{ color: '#666666', fontSize: '14px' }}>
            {t('auth.login')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          {error && (
            <div style={{
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#ff6b6b',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#888888',
              marginBottom: '8px',
            }}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#ededed',
                backgroundColor: '#0a0a0a',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#888888',
              marginBottom: '8px',
            }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#ededed',
                backgroundColor: '#0a0a0a',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
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
            {loading ? '...' : t('auth.login')}
          </button>
        </form>

        {/* Register link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666666',
          fontSize: '14px',
        }}>
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            style={{
              color: '#00d4ff',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
};
