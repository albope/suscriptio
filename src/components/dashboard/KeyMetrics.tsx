import { useTranslation } from 'react-i18next';
import { Subscription, BillingFrequency } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface KeyMetricsProps {
  activeCount: number;
  mostExpensive: Subscription | null;
  averageCost: number;
  subscriptionsByFrequency: { monthly: number; yearly: number };
}

// Shared card styles for consistency with SpendOverview
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

export const KeyMetrics = ({ activeCount, mostExpensive, averageCost, subscriptionsByFrequency }: KeyMetricsProps) => {
  const { t } = useTranslation();

  const mostExpensiveCost = mostExpensive
    ? mostExpensive.billingFrequency === BillingFrequency.MONTHLY
      ? formatCurrency(mostExpensive.cost, '€')
      : formatCurrency(mostExpensive.cost / 12, '€')
    : '€0.00';

  return (
    <>
      <style>{cardHoverStyle}</style>

      {/* Active Subscriptions Card */}
      <div
        className="metric-card"
        style={cardStyle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {t('dashboard.activeSubscriptions')}
            </p>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {activeCount}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {subscriptionsByFrequency.monthly} {t('dashboard.monthly')} · {subscriptionsByFrequency.yearly} {t('dashboard.yearly')}
            </p>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
            }}
          >
            <svg style={{ width: '22px', height: '22px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
        </div>

        {/* Subtle accent line */}
        <div style={{
          marginTop: '20px',
          height: '2px',
          background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
          borderRadius: '1px',
          opacity: 0.6,
        }} />
      </div>

      {/* Average Cost Card */}
      <div
        className="metric-card"
        style={cardStyle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {t('dashboard.averageCost')}
            </p>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {formatCurrency(averageCost, '€')}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {t('dashboard.perSubscription')}
            </p>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)',
            }}
          >
            <svg style={{ width: '22px', height: '22px', color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
        </div>

        {/* Subtle accent line */}
        <div style={{
          marginTop: '20px',
          height: '2px',
          background: 'linear-gradient(90deg, #22c55e 0%, rgba(34, 197, 94, 0.3) 50%, transparent 100%)',
          borderRadius: '1px',
          opacity: 0.6,
        }} />
      </div>

      {/* Most Expensive Card */}
      <div
        className="metric-card"
        style={cardStyle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {t('dashboard.mostExpensive')}
            </p>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '4px',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {mostExpensive ? mostExpensive.name : '-'}
            </h3>
            {mostExpensive && (
              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f59e0b',
                marginTop: '8px'
              }}>
                {mostExpensiveCost}
                <span style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: 500,
                  marginLeft: '4px'
                }}>
                  /mes
                </span>
              </p>
            )}
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)',
            }}
          >
            <svg style={{ width: '22px', height: '22px', color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
        </div>

        {/* Subtle accent line */}
        <div style={{
          marginTop: '20px',
          height: '2px',
          background: 'linear-gradient(90deg, #f59e0b 0%, rgba(245, 158, 11, 0.3) 50%, transparent 100%)',
          borderRadius: '1px',
          opacity: 0.6,
        }} />
      </div>
    </>
  );
};
