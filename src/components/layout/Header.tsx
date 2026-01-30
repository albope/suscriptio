import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <style>
        {`
          .header-container {
            position: sticky;
            top: 0;
            z-index: 40;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            background: linear-gradient(
              180deg,
              rgba(8, 8, 8, 0.85) 0%,
              rgba(8, 8, 8, 0.75) 100%
            );
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .header-inner {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 32px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .logo-wrapper {
            position: relative;
            width: 38px;
            height: 38px;
          }

          .logo-glow {
            position: absolute;
            inset: -4px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
            border-radius: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .logo-section:hover .logo-glow {
            opacity: 1;
          }

          .logo-img {
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            object-fit: contain;
            transition: transform 0.2s ease;
          }

          .logo-section:hover .logo-img {
            transform: scale(1.02);
          }

          .logo-text {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .nav-container {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
          }

          .nav-link {
            position: relative;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.01em;
            text-decoration: none;
            transition: all 0.15s ease;
            overflow: hidden;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              100px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(255, 255, 255, 0.06),
              transparent 40%
            );
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .nav-link:hover::before {
            opacity: 1;
          }

          .nav-link-inactive {
            color: #888888;
          }

          .nav-link-inactive:hover {
            color: #ededed;
            background: rgba(255, 255, 255, 0.04);
          }

          .nav-link-active {
            color: #00d4ff;
            background: rgba(0, 212, 255, 0.08);
            box-shadow:
              0 0 0 1px rgba(0, 212, 255, 0.15),
              0 0 20px -5px rgba(0, 212, 255, 0.2);
          }

          .nav-link-active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00d4ff, transparent);
            border-radius: 1px;
          }

          .user-section {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .user-email {
            font-size: 13px;
            color: #555555;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
            color: #00d4ff;
            text-transform: uppercase;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            color: #666666;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.08);
          }

          .logout-btn svg {
            transition: transform 0.2s ease;
          }

          .logout-btn:hover svg {
            transform: translateX(2px);
          }

          .divider {
            width: 1px;
            height: 24px;
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 100%
            );
          }

          @media (max-width: 768px) {
            .header-inner {
              padding: 0 16px;
              height: 56px;
            }

            .nav-container {
              display: none;
            }

            .user-email {
              display: none;
            }

            .divider {
              display: none;
            }
          }
        `}
      </style>

      <header className="header-container">
        <div className="header-inner">
          {/* Logo Section */}
          <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <div className="logo-wrapper">
              <div className="logo-glow" />
              <img src="/logo.png" alt="Suscriptio" className="logo-img" />
            </div>
            <span className="logo-text">Suscriptio</span>
          </Link>

          {/* Center Navigation */}
          <nav className="nav-container" aria-label={t('nav.main', 'Navegación principal')}>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'nav-link-active' : 'nav-link-inactive'}`}
              aria-current={isActive('/') ? 'page' : undefined}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <svg
                aria-hidden="true"
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  marginTop: '-2px',
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              {t('nav.dashboard')}
            </Link>
            <Link
              to="/subscriptions"
              className={`nav-link ${isActive('/subscriptions') ? 'nav-link-active' : 'nav-link-inactive'}`}
              aria-current={isActive('/subscriptions') ? 'page' : undefined}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <svg
                aria-hidden="true"
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  marginTop: '-2px',
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {t('nav.subscriptions')}
            </Link>
            <Link
              to="/settings"
              className={`nav-link ${isActive('/settings') ? 'nav-link-active' : 'nav-link-inactive'}`}
              aria-current={isActive('/settings') ? 'page' : undefined}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              <svg
                aria-hidden="true"
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  marginTop: '-2px',
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t('nav.settings')}
            </Link>
          </nav>

          {/* User Section */}
          {user && (
            <div className="user-section">
              <span className="user-email">{user.email}</span>

              <div className="user-avatar">{user.email?.charAt(0) || 'U'}</div>

              <div className="divider" />

              <button onClick={signOut} className="logout-btn" aria-label={t('auth.logout')}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
