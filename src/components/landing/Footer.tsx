import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.suscriptio.app';

export const Footer = () => {
  const { t } = useTranslation();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const linkStyle = (key: string): React.CSSProperties => ({
    fontSize: '14px',
    color: hoveredLink === key ? 'var(--text-primary, #ededed)' : 'var(--text-secondary, #888)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    lineHeight: 1.8,
    display: 'block',
  });

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 8px !important;
          }
        }
      `}</style>
      <footer
        style={{
          width: '100%',
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '60px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Main footer content */}
          <div
            className="footer-columns"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '64px',
              marginBottom: '48px',
            }}
          >
            {/* Left column - Brand */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Suscriptio"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                  }}
                />
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text-primary, #ededed)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Suscriptio
                </span>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary, #888)',
                  lineHeight: 1.7,
                  maxWidth: '320px',
                }}
              >
                {t('landing.footer.description')}
              </p>
            </div>

            {/* Center column - Product links */}
            <div>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #ededed)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                {t('landing.footer.product')}
              </h4>
              <nav>
                <a
                  href="#features"
                  style={linkStyle('features')}
                  onMouseEnter={() => setHoveredLink('features')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {t('landing.footer.features')}
                </a>
                <a
                  href="#pricing"
                  style={linkStyle('pricing')}
                  onMouseEnter={() => setHoveredLink('pricing')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {t('landing.footer.pricing')}
                </a>
              </nav>
            </div>

            {/* Right column - Account links */}
            <div>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #ededed)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                {t('landing.footer.account')}
              </h4>
              <nav>
                <Link
                  to="/login"
                  style={linkStyle('signIn')}
                  onMouseEnter={() => setHoveredLink('signIn')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {t('landing.footer.signIn')}
                </Link>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle('download')}
                  onMouseEnter={() => setHoveredLink('download')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {t('landing.footer.download')}
                </a>
              </nav>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.06)',
              marginBottom: '24px',
            }}
          />

          {/* Bottom bar */}
          <div
            className="footer-bottom"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #888)',
              }}
            >
              &copy; {new Date().getFullYear()} {t('landing.footer.copyright')}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #888)',
              }}
            >
              {t('landing.footer.madeWith')} {'\u2764\uFE0F'}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
