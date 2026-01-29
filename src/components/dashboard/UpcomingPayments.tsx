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
      style={{
        padding: '28px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 4px 24px -4px rgba(0, 0, 0, 0.4)
        `,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
          }}
        >
          <svg
            style={{ width: '20px', height: '20px', color: '#3b82f6' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '2px',
              letterSpacing: '-0.01em',
            }}
          >
            {t('dashboard.upcomingPayments')}
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {t('dashboard.next30Days')}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(0, 212, 255, 0.2), transparent)',
          margin: '20px 0',
          opacity: 0.5,
        }}
      />

      {subscriptions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '56px 20px',
          }}
        >
          {/* Empty state illustration */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            {/* Animated rings */}
            <div
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '24px',
                border: '2px solid rgba(59, 130, 246, 0.1)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '-16px',
                borderRadius: '28px',
                border: '1px solid rgba(59, 130, 246, 0.05)',
                animation: 'pulse 2s ease-in-out 0.5s infinite',
              }}
            />

            <svg
              style={{ width: '36px', height: '36px', color: '#3b82f6' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '8px',
            }}
          >
            {t('dashboard.noUpcoming')}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.35)',
              maxWidth: '280px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            No hay pagos programados próximamente
          </p>
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};
