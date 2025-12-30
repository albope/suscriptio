import { useTranslation } from 'react-i18next';
import { Subscription, BillingFrequency } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface KeyMetricsProps {
  activeCount: number;
  mostExpensive: Subscription | null;
}

export const KeyMetrics = ({ activeCount, mostExpensive }: KeyMetricsProps) => {
  const { t } = useTranslation();

  const mostExpensiveCost = mostExpensive
    ? mostExpensive.billingFrequency === BillingFrequency.MONTHLY
      ? formatCurrency(mostExpensive.cost, '€')
      : formatCurrency(mostExpensive.cost / 12, '€')
    : '€0.00';

  return (
    <>
      {/* Active Subscriptions Card */}
      <div
        className="card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#3b82f6', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('dashboard.activeSubscriptions')}
            </p>
            <h3 style={{ fontSize: '36px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>
              {activeCount}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666' }}>
              Suscripciones activas
            </p>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: '20px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: '2px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }} />
        </div>
      </div>

      {/* Most Expensive Card */}
      <div
        className="card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#f59e0b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('dashboard.mostExpensive')}
            </p>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#ededed', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mostExpensive ? mostExpensive.name : '-'}
            </h3>
            {mostExpensive && (
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#f59e0b' }}>
                {mostExpensiveCost}/mes
              </p>
            )}
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '16px',
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        {mostExpensive && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg style={{ width: '14px', height: '14px', color: '#f59e0b' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: '12px', color: '#666666' }}>Top gasto mensual</span>
          </div>
        )}
      </div>
    </>
  );
};
