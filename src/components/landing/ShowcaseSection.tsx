import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const MockKpiCard = ({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string;
  accentColor: string;
}) => (
  <div
    style={{
      background: 'rgba(17, 17, 17, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '12px',
      padding: '16px 18px',
      flex: 1,
      minWidth: 0,
    }}
  >
    <p
      style={{
        fontSize: '10px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '8px',
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: '22px',
        fontWeight: 700,
        color: accentColor,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        margin: 0,
      }}
    >
      {value}
    </p>
  </div>
);

const MockBarChart = () => {
  const bars = [
    { width: '78%', label: 'Jan', amount: '47.94' },
    { width: '85%', label: 'Feb', amount: '52.43' },
    { width: '65%', label: 'Mar', amount: '39.97' },
    { width: '92%', label: 'Apr', amount: '56.92' },
    { width: '70%', label: 'May', amount: '43.45' },
    { width: '88%', label: 'Jun', amount: '54.41' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {bars.map((bar) => (
        <div
          key={bar.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.4)',
              width: '28px',
              textAlign: 'right',
              flexShrink: 0,
              fontWeight: 500,
            }}
          >
            {bar.label}
          </span>
          <div
            style={{
              flex: 1,
              height: '18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: bar.width,
                height: '100%',
                background: 'linear-gradient(90deg, #00d4ff 0%, #00d4ff88 100%)',
                borderRadius: '4px',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.35)',
              width: '40px',
              textAlign: 'right',
              flexShrink: 0,
              fontWeight: 500,
            }}
          >
            {bar.amount}
          </span>
        </div>
      ))}
    </div>
  );
};

const MockSubscriptionRow = ({
  name,
  price,
  category,
  categoryColor,
}: {
  name: string;
  price: string;
  category: string;
  categoryColor: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
      {/* Fake logo circle */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: `${categoryColor}18`,
          border: `1px solid ${categoryColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: categoryColor }}>
          {name.charAt(0)}
        </span>
      </div>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#ededed',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <span
        style={{
          fontSize: '11px',
          padding: '3px 8px',
          background: `${categoryColor}12`,
          color: categoryColor,
          border: `1px solid ${categoryColor}25`,
          borderRadius: '6px',
          fontWeight: 600,
        }}
      >
        {category}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#00d4ff' }}>{price}</span>
    </div>
  </div>
);

export const ShowcaseSection = () => {
  const { t } = useTranslation();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: frameRef, isVisible: frameVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="showcase"
      style={{
        padding: '120px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .showcase-section-wrapper {
            padding: 80px 16px !important;
          }
          .showcase-browser-frame {
            transform: perspective(1200px) rotateX(1deg) !important;
          }
          .showcase-kpi-row {
            flex-direction: column !important;
          }
          .showcase-subs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          marginBottom: '64px',
          position: 'relative',
          zIndex: 1,
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
          {t('landing.showcase.title')}
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
          {t('landing.showcase.subtitle')}
        </p>
      </div>

      {/* Browser Frame */}
      <div
        ref={frameRef}
        className="showcase-browser-frame"
        style={{
          position: 'relative',
          zIndex: 1,
          transform: 'perspective(1200px) rotateX(2deg)',
          opacity: frameVisible ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.06),
            0 24px 80px -12px rgba(0, 0, 0, 0.6),
            0 0 60px -10px rgba(0, 212, 255, 0.12)
          `,
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Browser Chrome */}
        <div
          style={{
            background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Traffic light dots */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ff5f57',
              }}
            />
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#febc2e',
              }}
            />
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#28c840',
              }}
            />
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.35)',
                fontWeight: 500,
              }}
            >
              app.suscriptio.com/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard Content Area */}
        <div
          style={{
            background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
            padding: '24px',
          }}
        >
          {/* KPI Row */}
          <div
            className="showcase-kpi-row"
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <MockKpiCard label="Monthly Spend" value="$47.94" accentColor="#00d4ff" />
            <MockKpiCard label="Yearly Spend" value="$575.28" accentColor="#a855f7" />
            <MockKpiCard label="Active Subs" value="8" accentColor="#00ff94" />
          </div>

          {/* Chart Area */}
          <div
            style={{
              background: 'rgba(17, 17, 17, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                Spending Trend
              </p>
              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontWeight: 500,
                }}
              >
                Last 6 months
              </span>
            </div>
            <MockBarChart />
          </div>

          {/* Subscription Rows */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '4px',
              }}
            >
              Active Subscriptions
            </p>
            <MockSubscriptionRow
              name="Netflix"
              price="$15.49"
              category="Streaming"
              categoryColor="#e50914"
            />
            <MockSubscriptionRow
              name="Spotify"
              price="$10.99"
              category="Music"
              categoryColor="#1db954"
            />
            <MockSubscriptionRow
              name="iCloud+"
              price="$2.99"
              category="Cloud"
              categoryColor="#a855f7"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
