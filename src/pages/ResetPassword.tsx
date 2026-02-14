import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/validation';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, recoveryMode, updatePassword, clearRecoveryMode } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

  // If no user session and not in recovery mode, redirect to login
  useEffect(() => {
    if (!user && !recoveryMode) {
      navigate('/login');
    }
  }, [user, recoveryMode, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.map((err) => t(err)).join('. '));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('same password') || msg.includes('different')) {
        setError(t('auth.errors.samePassword'));
      } else {
        setError(t('auth.errors.passwordUpdateFailed'));
      }
      setLoading(false);
    } else {
      clearRecoveryMode();
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
            {t('auth.resetPasswordTitle')}
          </h1>
          <p style={{ color: '#666666', fontSize: '14px' }}>
            {t('auth.resetPasswordSubtitle')}
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
            <div>
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '10px',
                  padding: '16px',
                  color: '#22c55e',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
              >
                {t('auth.passwordResetSuccess')}
              </div>
              <Link
                to="/"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '10px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                }}
              >
                {t('auth.goToDashboard')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  {t('auth.newPassword')}
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
                          <span>{check ? '\u2713' : '\u25CB'}</span>
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
                  {t('auth.confirmNewPassword')}
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
                {loading ? t('auth.settingPassword') : t('auth.setNewPassword')}
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
