import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { PRICING, ANNUAL_SAVINGS_PERCENT, STRIPE_PRICES } from '@/constants/billing';
import { FREE_TIER_MAX_SUBSCRIPTIONS } from '@/constants/billing';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { t } = useTranslation();
  const { checkout, isLoading } = useStripeCheckout();

  const handleCheckout = (period: 'monthly' | 'annual') => {
    const priceId = STRIPE_PRICES[period];
    if (priceId) {
      checkout(priceId);
    }
  };

  const features = {
    free: [
      t('billing.features.maxSubscriptions', { max: FREE_TIER_MAX_SUBSCRIPTIONS }),
      t('billing.features.basicAnalytics'),
      t('billing.features.exportData'),
    ],
    premium: [
      t('billing.features.unlimitedSubscriptions'),
      t('billing.features.fullAnalytics'),
      t('billing.features.exportData'),
      t('billing.features.prioritySupport'),
    ],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('billing.upgrade')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Monthly */}
          <div
            style={{
              padding: '20px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(17, 17, 17, 0.6)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '8px', fontWeight: 500 }}>
              {t('billing.monthly')}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#ededed', marginBottom: '4px' }}>
              {PRICING.monthly.currency === 'EUR' ? '€' : '$'}
              {PRICING.monthly.amount}
            </p>
            <p style={{ fontSize: '12px', color: '#666666' }}>/{t('billing.perMonth')}</p>
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={isLoading || !STRIPE_PRICES.monthly}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#111111',
                color: '#ededed',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {t('billing.selectPlan')}
            </button>
          </div>

          {/* Annual */}
          <div
            style={{
              padding: '20px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 187, 0, 0.3)',
              background: 'linear-gradient(180deg, rgba(255, 187, 0, 0.05) 0%, rgba(255, 140, 0, 0.02) 100%)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #ffbb00, #ff8c00)',
                color: '#000',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {t('billing.popularChoice')}
            </span>
            <p style={{ fontSize: '12px', color: '#888888', marginBottom: '8px', fontWeight: 500 }}>
              {t('billing.annual')}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#ededed', marginBottom: '4px' }}>
              {PRICING.annual.currency === 'EUR' ? '€' : '$'}
              {PRICING.annual.amount}
            </p>
            <p style={{ fontSize: '12px', color: '#ffbb00' }}>
              /{t('billing.perYear')} · {t('billing.savePercent', { percent: ANNUAL_SAVINGS_PERCENT })}
            </p>
            <button
              onClick={() => handleCheckout('annual')}
              disabled={isLoading || !STRIPE_PRICES.annual}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(180deg, #ffbb00 0%, #ff8c00 100%)',
                color: '#000',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 20px rgba(255, 187, 0, 0.25)',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {t('billing.selectPlan')}
            </button>
          </div>
        </div>

        {/* Feature comparison */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(17, 17, 17, 0.4)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Free features */}
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#888888',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('billing.features.freeTitle')}
              </p>
              {features.free.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                    fontSize: '12px',
                    color: '#999999',
                  }}
                >
                  <span style={{ color: '#666666' }}>&#10003;</span>
                  {feature}
                </div>
              ))}
            </div>

            {/* Premium features */}
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ffbb00',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('billing.features.premiumTitle')}
              </p>
              {features.premium.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                    fontSize: '12px',
                    color: '#ededed',
                  }}
                >
                  <span style={{ color: '#ffbb00' }}>&#10003;</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
