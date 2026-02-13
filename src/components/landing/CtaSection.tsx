import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.suscriptio.app';

export const CtaSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .cta-section-heading {
            font-size: 30px !important;
          }
          .cta-section-subtitle {
            font-size: 16px !important;
          }
        }
      `}</style>
      <section
        ref={ref}
        style={{
          padding: '120px 24px',
          position: 'relative',
          overflow: 'hidden',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Background gradient mesh */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 30% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 60%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '700px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            className="cta-section-heading"
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'var(--text-primary, #ededed)',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {t('landing.cta.title')}
          </h2>
          <p
            className="cta-section-subtitle"
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary, #888)',
              marginBottom: '40px',
              lineHeight: 1.6,
            }}
          >
            {t('landing.cta.subtitle')}
          </p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 40px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
              color: '#000',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: hoveredButton
                ? '0 8px 40px rgba(0, 212, 255, 0.45)'
                : '0 4px 24px rgba(0, 212, 255, 0.3)',
              transform: hoveredButton ? 'translateY(-2px)' : 'translateY(0)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33-2.965 1.716-2.36-2.36 3.023-3.023v2.337zM5.864 2.658L16.8 8.991l-2.302 2.302L5.864 2.658z" />
            </svg>
            {t('landing.cta.button')}
          </a>
        </div>
      </section>
    </>
  );
};
