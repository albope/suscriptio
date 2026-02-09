import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FeatureCardData {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  accentColor: string;
}

const FeatureCard = ({
  titleKey,
  descriptionKey,
  icon,
  accentColor,
  index,
}: FeatureCardData & { index: number }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(17, 17, 17, 0.8)',
        border: `1px solid ${isHovered ? `${accentColor}33` : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '16px',
        padding: '32px',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 8px 32px -8px ${accentColor}20, 0 0 0 1px ${accentColor}15 inset`
          : '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        opacity: isVisible ? 1 : 0,
        willChange: 'transform, opacity',
        transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Icon Container */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%)`,
          border: `1px solid ${accentColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: `0 0 24px ${accentColor}15`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#ededed',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
        }}
      >
        {t(titleKey)}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          color: '#888',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {t(descriptionKey)}
      </p>
    </div>
  );
};

export const FeaturesSection = () => {
  const { t } = useTranslation();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });

  const features: FeatureCardData[] = [
    {
      titleKey: 'landing.features.dashboard.title',
      descriptionKey: 'landing.features.dashboard.description',
      accentColor: '#00d4ff',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      ),
    },
    {
      titleKey: 'landing.features.management.title',
      descriptionKey: 'landing.features.management.description',
      accentColor: '#a855f7',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      titleKey: 'landing.features.multicurrency.title',
      descriptionKey: 'landing.features.multicurrency.description',
      accentColor: '#00ff94',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00ff94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="9" r="7" />
          <path d="M15 15a7 7 0 1 0 0-0.01" />
          <path d="M9 6v6" />
          <path d="M7 8h4" />
        </svg>
      ),
    },
    {
      titleKey: 'landing.features.calendar.title',
      descriptionKey: 'landing.features.calendar.description',
      accentColor: '#00d4ff',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
        </svg>
      ),
    },
    {
      titleKey: 'landing.features.export.title',
      descriptionKey: 'landing.features.export.description',
      accentColor: '#a855f7',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
    {
      titleKey: 'landing.features.pwa.title',
      descriptionKey: 'landing.features.pwa.description',
      accentColor: '#00ff94',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00ff94"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
          <path d="M9 8l1.5 1.5L9 11" />
          <path d="M15 8l-1.5 1.5L15 11" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '120px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .features-section-wrapper {
            padding: 80px 16px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          marginBottom: '64px',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <h2
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: '#ededed',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {t('landing.features.title')}
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#888',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t('landing.features.subtitle')}
        </p>
      </div>

      {/* Feature Grid */}
      <div
        className="features-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard key={feature.titleKey} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
};
