import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navLinks = [
  { key: 'landing.nav.features', href: 'features' },
  { key: 'landing.nav.screenshots', href: 'showcase' },
  { key: 'landing.nav.pricing', href: 'pricing' },
];

export const LandingNav = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredSignIn, setHoveredSignIn] = useState(false);
  const [hoveredGetStarted, setHoveredGetStarted] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <style>
        {`
          .landing-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .landing-nav-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .landing-nav-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
          }

          .landing-nav-logo-text {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .landing-nav-center {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .landing-nav-link {
            padding: 8px 18px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #888888;
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.2s ease, background 0.2s ease;
            font-family: inherit;
          }

          .landing-nav-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .landing-nav-hamburger {
            display: none;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            background: none;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
            color: #ededed;
            transition: border-color 0.2s ease;
          }

          .landing-nav-hamburger:hover {
            border-color: rgba(255, 255, 255, 0.2);
          }

          .landing-nav-mobile-panel {
            display: none;
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            padding: 16px 24px 24px;
            z-index: 49;
            animation: landing-nav-slideDown 0.25s ease-out;
          }

          .landing-nav-mobile-link {
            display: block;
            width: 100%;
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 500;
            color: #888888;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
            transition: color 0.2s ease, background 0.2s ease;
            font-family: inherit;
          }

          .landing-nav-mobile-link:hover {
            color: #ededed;
            background: rgba(255, 255, 255, 0.04);
          }

          .landing-nav-mobile-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.06);
            margin: 12px 0;
          }

          .landing-nav-mobile-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          @keyframes landing-nav-slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .landing-nav-center {
              display: none;
            }

            .landing-nav-right {
              display: none;
            }

            .landing-nav-hamburger {
              display: flex;
            }

            .landing-nav-mobile-panel.open {
              display: block;
            }
          }
        `}
      </style>

      <nav className="landing-nav" aria-label="Landing navigation">
        <div className="landing-nav-inner">
          {/* Logo */}
          <Link to="/" className="landing-nav-logo">
            <img
              src="/logo.png"
              alt="Suscriptio"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                objectFit: 'contain',
              }}
            />
            <span className="landing-nav-logo-text">Suscriptio</span>
          </Link>

          {/* Center nav links (desktop) */}
          <div className="landing-nav-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                className="landing-nav-link"
                onClick={() => scrollToSection(link.href)}
                onMouseEnter={(e) => {
                  setHoveredLink(link.href);
                  e.currentTarget.style.color = '#ededed';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseLeave={(e) => {
                  setHoveredLink(null);
                  e.currentTarget.style.color = '#888888';
                  e.currentTarget.style.background = 'none';
                }}
                style={{
                  color: hoveredLink === link.href ? '#ededed' : '#888888',
                }}
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          {/* Right buttons (desktop) */}
          <div className="landing-nav-right">
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 18px',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '10px',
                border: hoveredSignIn
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                background: hoveredSignIn ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                color: '#ededed',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredSignIn(true)}
              onMouseLeave={() => setHoveredSignIn(false)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ marginRight: '8px' }}
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              {t('landing.nav.signIn')}
            </Link>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
                border: 'none',
                background: hoveredGetStarted
                  ? 'linear-gradient(135deg, #00e5ff 0%, #00b8d4 100%)'
                  : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                color: '#000',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                boxShadow: hoveredGetStarted
                  ? '0 0 0 1px rgba(0, 212, 255, 0.5), 0 8px 30px rgba(0, 212, 255, 0.4)'
                  : '0 0 0 1px rgba(0, 212, 255, 0.3), 0 4px 20px rgba(0, 212, 255, 0.25)',
                transform: hoveredGetStarted ? 'translateY(-1px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredGetStarted(true)}
              onMouseLeave={() => setHoveredGetStarted(false)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ marginRight: '8px' }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              {t('landing.nav.getStarted')}
            </Link>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="landing-nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      <div className={`landing-nav-mobile-panel ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <button
            key={link.href}
            className="landing-nav-mobile-link"
            onClick={() => scrollToSection(link.href)}
          >
            {t(link.key)}
          </button>
        ))}

        <div className="landing-nav-mobile-divider" />

        <div className="landing-nav-mobile-buttons">
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 500,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent',
              color: '#ededed',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10,17 15,12 10,7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {t('landing.nav.signIn')}
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
              color: '#000',
              textDecoration: 'none',
              boxShadow: '0 0 0 1px rgba(0, 212, 255, 0.3), 0 4px 20px rgba(0, 212, 255, 0.25)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            {t('landing.nav.getStarted')}
          </Link>
        </div>
      </div>
    </>
  );
};
