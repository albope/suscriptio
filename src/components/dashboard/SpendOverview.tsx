import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/calculations';

interface CurrencySpend {
  currency: string;
  monthly: number;
  yearly: number;
  count: number;
}

interface SpendOverviewProps {
  spendByCurrency: CurrencySpend[];
}

// Shared card styles for consistency
const cardStyle = {
  padding: '28px',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',
  boxShadow: `
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 4px 24px -4px rgba(0, 0, 0, 0.4)
  `,
};

const cardHoverStyle = `
  .metric-card {
    position: relative;
    overflow: hidden;
  }
  .metric-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.03),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .metric-card:hover::before {
    opacity: 1;
  }
  .metric-card:hover {
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 8px 32px -4px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 212, 255, 0.05);
  }
`;

export const SpendOverview = ({ spendByCurrency }: SpendOverviewProps) => {
  const { t } = useTranslation();

  // If only one currency, show simple cards
  const isSingleCurrency = spendByCurrency.length <= 1;
  const primarySpend = spendByCurrency[0] || { currency: 'EUR', monthly: 0, yearly: 0, count: 0 };

  if (isSingleCurrency) {
    return (
      <>
        <style>{cardHoverStyle}</style>

        {/* Monthly Spend Card */}
        <div
          className="metric-card"
          style={cardStyle}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }}
        >
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {t('dashboard.monthlySpend')}
              </p>
              <h3
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#ededed',
                  marginBottom: '8px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {formatCurrency(primarySpend.monthly, primarySpend.currency)}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
                {t('dashboard.monthlySpendSubtitle')}
              </p>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
              }}
            >
              <svg
                style={{ width: '22px', height: '22px', color: '#00d4ff' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Subtle accent line */}
          <div
            style={{
              marginTop: '20px',
              height: '2px',
              background:
                'linear-gradient(90deg, #00d4ff 0%, rgba(0, 212, 255, 0.3) 50%, transparent 100%)',
              borderRadius: '1px',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Yearly Spend Card */}
        <div
          className="metric-card"
          style={cardStyle}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }}
        >
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {t('dashboard.yearlySpend')}
              </p>
              <h3
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#ededed',
                  marginBottom: '8px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {formatCurrency(primarySpend.yearly, primarySpend.currency)}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
                {t('dashboard.yearlySpendSubtitle')}
              </p>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
              }}
            >
              <svg
                style={{ width: '22px', height: '22px', color: '#a855f7' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
            </div>
          </div>

          {/* Subtle accent line */}
          <div
            style={{
              marginTop: '20px',
              height: '2px',
              background:
                'linear-gradient(90deg, #a855f7 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)',
              borderRadius: '1px',
              opacity: 0.6,
            }}
          />
        </div>
      </>
    );
  }

  // Multiple currencies - show combined card with breakdown
  return (
    <>
      <style>{cardHoverStyle}</style>

      {/* Monthly Spend Card - Multi-currency */}
      <div
        className="metric-card"
        style={cardStyle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {t('dashboard.monthlySpend')}
          </p>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background:
                'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
            }}
          >
            <svg
              style={{ width: '18px', height: '18px', color: '#00d4ff' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Currency breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {spendByCurrency.map((spend, index) => (
            <div
              key={spend.currency}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background:
                  index === 0
                    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 212, 255, 0.02) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                border:
                  index === 0
                    ? '1px solid rgba(0, 212, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: index === 0 ? '#00d4ff' : 'rgba(255, 255, 255, 0.5)',
                    padding: '3px 8px',
                    background:
                      index === 0 ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                  }}
                >
                  {spend.currency}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
                  {spend.count}{' '}
                  {spend.count === 1 ? t('dashboard.subscription') : t('dashboard.subscriptions')}
                </span>
              </div>
              <span
                style={{
                  fontSize: index === 0 ? '20px' : '16px',
                  fontWeight: 700,
                  color: index === 0 ? '#ededed' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {formatCurrency(spend.monthly, spend.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtle accent line */}
        <div
          style={{
            marginTop: '16px',
            height: '2px',
            background:
              'linear-gradient(90deg, #00d4ff 0%, rgba(0, 212, 255, 0.3) 50%, transparent 100%)',
            borderRadius: '1px',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Yearly Spend Card - Multi-currency */}
      <div
        className="metric-card"
        style={cardStyle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {t('dashboard.yearlySpend')}
          </p>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background:
                'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
            }}
          >
            <svg
              style={{ width: '18px', height: '18px', color: '#a855f7' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
          </div>
        </div>

        {/* Currency breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {spendByCurrency.map((spend, index) => (
            <div
              key={spend.currency}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background:
                  index === 0
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.02) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                border:
                  index === 0
                    ? '1px solid rgba(168, 85, 247, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: index === 0 ? '#a855f7' : 'rgba(255, 255, 255, 0.5)',
                    padding: '3px 8px',
                    background:
                      index === 0 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                  }}
                >
                  {spend.currency}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
                  {spend.count}{' '}
                  {spend.count === 1 ? t('dashboard.subscription') : t('dashboard.subscriptions')}
                </span>
              </div>
              <span
                style={{
                  fontSize: index === 0 ? '20px' : '16px',
                  fontWeight: 700,
                  color: index === 0 ? '#ededed' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {formatCurrency(spend.yearly, spend.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtle accent line */}
        <div
          style={{
            marginTop: '16px',
            height: '2px',
            background:
              'linear-gradient(90deg, #a855f7 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)',
            borderRadius: '1px',
            opacity: 0.6,
          }}
        />
      </div>
    </>
  );
};
