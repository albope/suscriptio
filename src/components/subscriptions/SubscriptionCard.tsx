import { useTranslation } from 'react-i18next';
import { Subscription, BillingFrequency } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate, getDaysUntilPayment, getPaymentLabel } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/calculations';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard = ({ subscription, onClick, onDelete }: SubscriptionCardProps) => {
  const { t } = useTranslation();
  const daysUntil = getDaysUntilPayment(subscription.nextPaymentDate);
  const paymentLabel = getPaymentLabel(daysUntil);

  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      className="hover:bg-white/[0.04] hover:border-cyan-500/20"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + Warning Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#ededed',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subscription.name}
            </h3>
            {paymentLabel && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '6px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {paymentLabel}
              </span>
            )}
          </div>

          {/* Price + Frequency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#00d4ff' }}>
              {formatCurrency(subscription.cost, subscription.currency)}
            </span>
            <span style={{ fontSize: '12px', color: '#555555' }}>·</span>
            <span style={{ fontSize: '12px', color: '#888888' }}>
              {subscription.billingFrequency === BillingFrequency.MONTHLY
                ? t('subscriptions.frequency.monthly')
                : t('subscriptions.frequency.yearly')}
            </span>
          </div>

          {/* Date + Category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: subscription.tags && subscription.tags.length > 0 ? '8px' : '0',
            }}
          >
            <svg
              style={{ width: '14px', height: '14px', color: '#666666' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span style={{ fontSize: '12px', color: '#888888', fontWeight: 500 }}>
              {formatDate(subscription.nextPaymentDate)}
            </span>
            {subscription.category && (
              <>
                <span style={{ fontSize: '12px', color: '#444444' }}>·</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    color: '#888888',
                    fontWeight: 500,
                  }}
                >
                  {t(`subscriptions.categories.${subscription.category}`)}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {subscription.tags && subscription.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {subscription.tags.slice(0, 3).map((tag) => {
                // Generate consistent color for each tag
                let hash = 0;
                for (let i = 0; i < tag.length; i++) {
                  hash = tag.charCodeAt(i) + ((hash << 5) - hash);
                }
                const colors = [
                  {
                    bg: 'rgba(0, 212, 255, 0.12)',
                    text: '#00d4ff',
                    border: 'rgba(0, 212, 255, 0.3)',
                  },
                  {
                    bg: 'rgba(138, 43, 226, 0.12)',
                    text: '#b37fe8',
                    border: 'rgba(138, 43, 226, 0.3)',
                  },
                  {
                    bg: 'rgba(255, 107, 107, 0.12)',
                    text: '#ff6b6b',
                    border: 'rgba(255, 107, 107, 0.3)',
                  },
                  {
                    bg: 'rgba(72, 219, 251, 0.12)',
                    text: '#48dbfb',
                    border: 'rgba(72, 219, 251, 0.3)',
                  },
                  {
                    bg: 'rgba(255, 159, 64, 0.12)',
                    text: '#ff9f40',
                    border: 'rgba(255, 159, 64, 0.3)',
                  },
                ];
                const color = colors[Math.abs(hash) % colors.length];

                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      background: color.bg,
                      color: color.text,
                      border: `1px solid ${color.border}`,
                      borderRadius: '6px',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
              {subscription.tags.length > 3 && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#666666',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    fontWeight: 500,
                  }}
                >
                  {t('tags.moreCount', { count: subscription.tags.length - 3 })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: Badge + Actions */}
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={subscription.status === 'active' ? 'success' : 'danger'}>
              {t(`subscriptions.status.${subscription.status}`)}
            </Badge>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(subscription.id);
                }}
                title={t('subscriptions.delete', 'Eliminar')}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <svg
                  style={{ width: '14px', height: '14px', color: '#ef4444' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              style={{ width: '16px', height: '16px', color: '#666666' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
