import { useTranslation } from 'react-i18next';
import { Subscription } from '@/types';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
}

export const UpcomingPayments = ({ subscriptions, onSubscriptionClick }: UpcomingPaymentsProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="card"
      style={{
        padding: '28px',
        borderRadius: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg style={{ width: '22px', height: '22px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ededed', marginBottom: '4px' }}>{t('dashboard.upcomingPayments')}</h2>
          <p style={{ fontSize: '13px', color: '#666666' }}>{t('dashboard.next30Days')}</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.2), transparent)', margin: '20px 0' }} />

      {subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <svg style={{ width: '28px', height: '28px', color: '#666666' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#999999' }}>{t('dashboard.noUpcoming')}</p>
          <p style={{ fontSize: '12px', color: '#666666', marginTop: '6px' }}>No hay pagos programados próximamente</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onClick={() => onSubscriptionClick(sub)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
