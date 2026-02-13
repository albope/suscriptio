import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="#f59e0b"
    stroke="#f59e0b"
    strokeWidth="1"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Stars = ({ count = 5 }: { count?: number }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {Array.from({ length: count }).map((_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
);

interface Testimonial {
  nameKey: string;
  roleKey: string;
  quoteKey: string;
  initial: string;
  accentColor: string;
}

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(17, 17, 17, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Stars */}
      <Stars />

      {/* Quote */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--text-primary, #ededed)',
          margin: 0,
          flex: 1,
        }}
      >
        &ldquo;{t(testimonial.quoteKey)}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${testimonial.accentColor}30, ${testimonial.accentColor}10)`,
            border: `1px solid ${testimonial.accentColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: testimonial.accentColor,
            }}
          >
            {testimonial.initial}
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary, #ededed)',
              margin: 0,
            }}
          >
            {t(testimonial.nameKey)}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary, #888)',
              margin: 0,
            }}
          >
            {t(testimonial.roleKey)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const SocialProofSection = () => {
  const { t } = useTranslation();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });

  const testimonials: Testimonial[] = [
    {
      nameKey: 'landing.social.testimonial1.name',
      roleKey: 'landing.social.testimonial1.role',
      quoteKey: 'landing.social.testimonial1.quote',
      initial: 'M',
      accentColor: '#00d4ff',
    },
    {
      nameKey: 'landing.social.testimonial2.name',
      roleKey: 'landing.social.testimonial2.role',
      quoteKey: 'landing.social.testimonial2.quote',
      initial: 'C',
      accentColor: '#a855f7',
    },
    {
      nameKey: 'landing.social.testimonial3.name',
      roleKey: 'landing.social.testimonial3.role',
      quoteKey: 'landing.social.testimonial3.quote',
      initial: 'L',
      accentColor: '#00ff94',
    },
  ];

  const stats = [
    { key: 'landing.social.statUsers', icon: '👥' },
    { key: 'landing.social.statRating', icon: '⭐' },
    { key: 'landing.social.statPrivacy', icon: '🔒' },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .social-testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .social-stats-bar {
            gap: 20px !important;
          }
        }
      `}</style>
      <section
        style={{
          padding: '100px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            marginBottom: '48px',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--text-primary, #ededed)',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            {t('landing.social.title')}
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary, #888)',
              lineHeight: 1.6,
            }}
          >
            {t('landing.social.subtitle')}
          </p>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="social-stats-bar"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginBottom: '48px',
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.15s',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary, #ededed)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{stat.icon}</span>
              {t(stat.key)}
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div
          className="social-testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.nameKey} testimonial={testimonial} index={index} />
          ))}
        </div>
      </section>
    </>
  );
};
