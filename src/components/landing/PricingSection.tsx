import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00ff94"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PricingSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const [hoveredFree, setHoveredFree] = useState(false);
  const [hoveredPro, setHoveredPro] = useState(false);

  const freeFeatures = [
    t('landing.pricing.freeFeatures.subscriptions'),
    t('landing.pricing.freeFeatures.dashboard'),
    t('landing.pricing.freeFeatures.exportJson'),
    t('landing.pricing.freeFeatures.pwa'),
    t('landing.pricing.freeFeatures.bilingual'),
  ];

  const proFeatures = [
    t('landing.pricing.proFeatures.allFree'),
    t('landing.pricing.proFeatures.unlimited'),
    t('landing.pricing.proFeatures.analytics'),
    t('landing.pricing.proFeatures.multicurrency'),
    t('landing.pricing.proFeatures.calendar'),
    t('landing.pricing.proFeatures.exportCsv'),
    t('landing.pricing.proFeatures.notifications'),
    t('landing.pricing.proFeatures.priority'),
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <section
        id="pricing"
        ref={ref}
        style={{
          padding: '120px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--text-primary, #ededed)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            {t('landing.pricing.title')}
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary, #888)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        {/* Pricing cards grid */}
        <div
          className="pricing-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Free card */}
          <div
            style={{
              background: 'rgba(17, 17, 17, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
              transform: hoveredFree ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredFree(true)}
            onMouseLeave={() => setHoveredFree(false)}
          >
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #888)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('landing.pricing.free')}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  marginTop: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    color: 'var(--text-primary, #ededed)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {'\u20AC'}0
                </span>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary, #888)',
                  marginTop: '8px',
                }}
              >
                {t('landing.pricing.freePeriod')}
              </p>
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '40px',
                flex: 1,
              }}
            >
              {freeFeatures.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckIcon />
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-primary, #ededed)',
                      lineHeight: 1.4,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/register"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'transparent',
                color: 'var(--text-primary, #ededed)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              {t('landing.pricing.ctaFree')}
            </Link>
          </div>

          {/* Pro card (highlighted) */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(17, 17, 17, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 40px rgba(0, 212, 255, 0.08), 0 0 80px rgba(0, 212, 255, 0.04)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              transform: hoveredPro ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredPro(true)}
            onMouseLeave={() => setHoveredPro(false)}
          >
            {/* Popular badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--accent-cyan, #00d4ff)',
                color: '#000',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '100px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('landing.pricing.popular')}
            </div>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--accent-cyan, #00d4ff)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('landing.pricing.pro')}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  marginTop: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    color: 'var(--text-primary, #ededed)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {'\u20AC'}6.99
                </span>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary, #888)',
                  marginTop: '8px',
                }}
              >
                {t('landing.pricing.proPeriod')}
              </p>
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '40px',
                flex: 1,
              }}
            >
              {proFeatures.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckIcon />
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-primary, #ededed)',
                      lineHeight: 1.4,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/register"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                color: '#000',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t('landing.pricing.ctaPro')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
