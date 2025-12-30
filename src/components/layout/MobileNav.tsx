import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 50,
      }}
      className="md:hidden"
    >
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 24px',
            color: isActive('/') ? '#00d4ff' : '#666666',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: isActive('/') ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
              boxShadow: isActive('/') ? '0 0 15px rgba(0, 212, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>{t('nav.dashboard')}</span>
        </Link>
        <Link
          to="/subscriptions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 24px',
            color: isActive('/subscriptions') ? '#00d4ff' : '#666666',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: isActive('/subscriptions') ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
              boxShadow: isActive('/subscriptions') ? '0 0 15px rgba(0, 212, 255, 0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>{t('nav.subscriptions')}</span>
        </Link>
      </div>
    </nav>
  );
};
