import { useTranslation } from 'react-i18next';
import { Subscription, BillingFrequency } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ServiceLogo } from '@/components/ui/ServiceLogo';
import { formatDate, getDaysUntilPayment, getPaymentLabel, getTrialDaysRemaining } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/calculations';
import { findService } from '@/utils/serviceMatch';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard = ({ subscription, onClick, onDelete }: SubscriptionCardProps) => {
  const { t } = useTranslation();
  const daysUntil = getDaysUntilPayment(subscription.nextPaymentDate);
  const paymentLabel = getPaymentLabel(daysUntil);

  // Resolve color: explicit > brand color > default
  const service = findService(subscription.name);
  const accentColor = subscription.color || service?.brandColor || '#00d4ff';

  // Trial tracking
  const hasActiveTrial = subscription.trialEndDate && getTrialDaysRemaining(subscription.trialEndDate) >= 0;
  const trialDays = subscription.trialEndDate ? getTrialDaysRemaining(subscription.trialEndDate) : null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${subscription.name}, ${formatCurrency(subscription.cost, subscription.currency)} ${subscription.billingFrequency === BillingFrequency.MONTHLY ? t('subscriptions.frequency.monthly') : t('subscriptions.frequency.yearly')}`}
      style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      className="hover:bg-white/[0.04] hover:border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-black"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        {/* Left: Logo + Info */}
        <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: 0 }}>
          <ServiceLogo
            name={subscription.name}
            size={40}
            category={subscription.category}
            brandColor={subscription.color}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + Labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
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
              {hasActiveTrial && trialDays !== null && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: trialDays <= 3
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                    color: trialDays <= 3 ? '#ef4444' : '#10b981',
                    border: `1px solid ${trialDays <= 3 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    borderRadius: '6px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {trialDays === 0
                    ? t('trial.expiringToday', 'Trial expira hoy')
                    : trialDays === 1
                      ? t('trial.expiringTomorrow', 'Trial expira mañana')
                      : t('trial.daysRemaining', { days: trialDays, defaultValue: `${trialDays} días de trial` })}
                </span>
              )}
              {paymentLabel && !hasActiveTrial && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: accentColor }}>
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
                aria-hidden="true"
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
                  let hash = 0;
                  for (let i = 0; i < tag.length; i++) {
                    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const colors = [
                    { bg: 'rgba(0, 212, 255, 0.12)', text: '#00d4ff', border: 'rgba(0, 212, 255, 0.3)' },
                    { bg: 'rgba(138, 43, 226, 0.12)', text: '#b37fe8', border: 'rgba(138, 43, 226, 0.3)' },
                    { bg: 'rgba(255, 107, 107, 0.12)', text: '#ff6b6b', border: 'rgba(255, 107, 107, 0.3)' },
                    { bg: 'rgba(72, 219, 251, 0.12)', text: '#48dbfb', border: 'rgba(72, 219, 251, 0.3)' },
                    { bg: 'rgba(255, 159, 64, 0.12)', text: '#ff9f40', border: 'rgba(255, 159, 64, 0.3)' },
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
        </div>

        {/* Right: Badge + Actions */}
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
                aria-label={`${t('subscriptions.delete', 'Eliminar')} ${subscription.name}`}
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
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div
            aria-hidden="true"
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
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
