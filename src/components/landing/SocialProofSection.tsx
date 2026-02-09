import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ShieldIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const SocialProofSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();

  const stats = [
    {
      icon: <ZapIcon />,
      title: t('landing.social.stat1'),
      description: t('landing.social.stat1Desc'),
    },
    {
      icon: <SmartphoneIcon />,
      title: t('landing.social.stat2'),
      description: t('landing.social.stat2Desc'),
    },
    {
      icon: <GlobeIcon />,
      title: t('landing.social.stat3'),
      description: t('landing.social.stat3Desc'),
    },
    {
      icon: <ShieldIcon />,
      title: t('landing.social.stat4'),
      description: t('landing.social.stat4Desc'),
    },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .social-proof-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .social-proof-divider {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .social-proof-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
      <section
        ref={ref}
        style={{
          padding: '80px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div
          className="social-proof-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {stats.map((stat, index) => (
            <div key={`stat-group-${index}`} style={{ display: 'contents' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '24px 16px',
                }}
              >
                <div
                  style={{
                    color: 'var(--accent-cyan, #00d4ff)',
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.3))',
                  }}
                >
                  {stat.icon}
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary, #ededed)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {stat.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary, #888)',
                    lineHeight: 1.5,
                  }}
                >
                  {stat.description}
                </p>
              </div>
              {index < stats.length - 1 && (
                <div
                  className="social-proof-divider"
                  style={{
                    width: '1px',
                    height: '80px',
                    background:
                      'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
