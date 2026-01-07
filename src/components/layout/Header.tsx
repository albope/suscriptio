import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Suscriptio"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                objectFit: 'contain',
              }}
            />
            <span className="text-xl font-bold" style={{ color: '#ededed' }}>
              Suscriptio
            </span>
          </div>
          <nav className="hidden md:flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Link
              to="/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                ...(isActive('/')
                  ? { background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.2)' }
                  : { color: '#888888', border: '1px solid transparent' })
              }}
              onMouseEnter={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.color = '#ededed';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.color = '#888888';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              to="/subscriptions"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                ...(isActive('/subscriptions')
                  ? { background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.2)' }
                  : { color: '#888888', border: '1px solid transparent' })
              }}
              onMouseEnter={(e) => {
                if (!isActive('/subscriptions')) {
                  e.currentTarget.style.color = '#ededed';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/subscriptions')) {
                  e.currentTarget.style.color = '#888888';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {t('nav.subscriptions')}
            </Link>
          </nav>

          {/* User menu */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#666666', display: 'none' }} className="md:block">
                {user.email}
              </span>
              <button
                onClick={signOut}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#888888',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ff6b6b';
                  e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888888';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
