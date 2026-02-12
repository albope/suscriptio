import { useTranslation } from 'react-i18next';
import { useTierLimits } from '@/hooks/useTierLimits';
import { TIER_LIMITS } from '@/types/billing';

interface SubscriptionLimitBarProps {
  onUpgradeClick: () => void;
}

export const SubscriptionLimitBar = ({ onUpgradeClick }: SubscriptionLimitBarProps) => {
  const { t } = useTranslation();
  const { tier, currentCount, remainingSlots } = useTierLimits();

  if (tier === 'premium') return null;

  const max = TIER_LIMITS.free.maxActiveSubscriptions;
  const percentage = Math.min((currentCount / max) * 100, 100);
  const isFull = remainingSlots === 0;
  const isAlmostFull = remainingSlots === 1 && currentCount > 0;

  const barColor = isFull
    ? '#ff4444'
    : isAlmostFull
      ? '#ffbb00'
      : '#00d4ff';

  const barGlow = isFull
    ? 'rgba(255, 68, 68, 0.3)'
    : isAlmostFull
      ? 'rgba(255, 187, 0, 0.3)'
      : 'rgba(0, 212, 255, 0.3)';

  return (
    <div
      style={{
        padding: '14px 18px',
        background: 'rgba(17, 17, 17, 0.6)',
        border: `1px solid ${isFull ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
      }}
    >
      {/* Progress section */}
      <div style={{ flex: 1, minWidth: '160px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
            {t('billing.subscriptionsUsed', { current: currentCount, max })}
          </span>
          {isAlmostFull && !isFull && (
            <span style={{ fontSize: '11px', color: '#ffbb00', fontWeight: 600 }}>
              {t('onboarding.lastSlot')}
            </span>
          )}
        </div>

        {/* Bar */}
        <div
          style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: barColor,
              borderRadius: '3px',
              boxShadow: `0 0 8px ${barGlow}`,
              transition: 'width 0.4s ease, background 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* CTA */}
      {isFull ? (
        <button
          onClick={onUpgradeClick}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
            color: '#000',
            fontWeight: 600,
            fontSize: '12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            boxShadow: '0 0 12px rgba(0, 212, 255, 0.25)',
          }}
        >
          {t('onboarding.unlockUnlimited')}
        </button>
      ) : (
        <span
          style={{
            fontSize: '11px',
            color: '#555',
            whiteSpace: 'nowrap',
          }}
        >
          {t('billing.free')} · {t('onboarding.unlimitedFor', { price: '2.99' })}
        </span>
      )}
    </div>
  );
};
