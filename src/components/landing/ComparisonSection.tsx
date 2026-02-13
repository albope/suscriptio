import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CheckIcon = ({ color = '#00ff94' }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255, 255, 255, 0.2)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

type RowValue = boolean | string;

interface ComparisonRow {
  featureKey: string;
  free: RowValue;
  pro: RowValue;
}

const CellContent = ({ value }: { value: RowValue }) => {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <CrossIcon />;
  }
  return (
    <span
      style={{
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--text-primary, #ededed)',
      }}
    >
      {value}
    </span>
  );
};

export const ComparisonSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();

  const rows: ComparisonRow[] = [
    {
      featureKey: 'rows.subscriptions',
      free: t('landing.comparison.rows.subscriptionsFree'),
      pro: t('landing.comparison.rows.subscriptionsPro'),
    },
    {
      featureKey: 'rows.dashboard',
      free: t('landing.comparison.rows.dashboardFree'),
      pro: t('landing.comparison.rows.dashboardPro'),
    },
    { featureKey: 'rows.analytics', free: false, pro: true },
    { featureKey: 'rows.multicurrency', free: false, pro: true },
    { featureKey: 'rows.calendar', free: false, pro: true },
    { featureKey: 'rows.exportJson', free: true, pro: true },
    { featureKey: 'rows.exportCsv', free: false, pro: true },
    { featureKey: 'rows.reminders', free: false, pro: true },
    { featureKey: 'rows.tags', free: false, pro: true },
    {
      featureKey: 'rows.support',
      free: t('landing.comparison.rows.supportFree'),
      pro: t('landing.comparison.rows.supportPro'),
    },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .comparison-table {
            font-size: 13px !important;
          }
          .comparison-cell {
            padding: 14px 12px !important;
          }
          .comparison-header-cell {
            padding: 16px 12px !important;
          }
        }
      `}</style>
      <section
        ref={ref}
        style={{
          padding: '0 24px 120px',
          maxWidth: '800px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--text-primary, #ededed)',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            {t('landing.comparison.title')}
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary, #888)',
              lineHeight: 1.6,
            }}
          >
            {t('landing.comparison.subtitle')}
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(17, 17, 17, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 120px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              className="comparison-header-cell"
              style={{
                padding: '18px 24px',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-secondary, #888)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {t('landing.comparison.feature')}
            </div>
            <div
              className="comparison-header-cell"
              style={{
                padding: '18px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-secondary, #888)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              {t('landing.comparison.freeColumn')}
            </div>
            <div
              className="comparison-header-cell"
              style={{
                padding: '18px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--accent-cyan, #00d4ff)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                background: 'rgba(0, 212, 255, 0.04)',
              }}
            >
              {t('landing.comparison.proColumn')}
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, index) => (
            <div
              key={row.featureKey}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px',
                borderBottom:
                  index < rows.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div
                className="comparison-cell"
                style={{
                  padding: '16px 24px',
                  fontSize: '14px',
                  color: 'var(--text-primary, #ededed)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t(`landing.comparison.${row.featureKey}`)}
              </div>
              <div
                className="comparison-cell"
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CellContent value={row.free} />
              </div>
              <div
                className="comparison-cell"
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 212, 255, 0.02)',
                }}
              >
                <CellContent value={row.pro} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
