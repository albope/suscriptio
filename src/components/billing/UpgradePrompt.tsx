import { useTranslation } from 'react-i18next';
import { PRICING, ANNUAL_SAVINGS_PERCENT, STRIPE_PRICES } from '@/constants/billing';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { FREE_TIER_MAX_SUBSCRIPTIONS } from '@/constants/billing';

export const UpgradePrompt = () => {
  const { t } = useTranslation();
  const { checkout, isLoading } = useStripeCheckout();

  const handleCheckout = (period: 'monthly' | 'annual') => {
    const priceId = STRIPE_PRICES[period];
    if (priceId) {
      checkout(priceId);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '32px 24px',
      }}
    >
      {/* Lock icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255, 187, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)',
          border: '1px solid rgba(255, 187, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffbb00"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#ededed',
          marginBottom: '8px',
        }}
      >
        {t('billing.upgrade')}
      </h3>

      <p
        style={{
          fontSize: '14px',
          color: '#888888',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {t('billing.limitReached', { max: FREE_TIER_MAX_SUBSCRIPTIONS })}
      </p>

      {/* Pricing buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => handleCheckout('annual')}
          disabled={isLoading || !STRIPE_PRICES.annual}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(180deg, #ffbb00 0%, #ff8c00 100%)',
            color: '#000',
            boxShadow: '0 0 0 1px rgba(255, 187, 0, 0.3), 0 4px 20px rgba(255, 187, 0, 0.25)',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {t('billing.annualPrice', { amount: PRICING.annual.amount })}
            <span
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            >
              {t('billing.savePercent', { percent: ANNUAL_SAVINGS_PERCENT })}
            </span>
          </span>
        </button>

        <button
          onClick={() => handleCheckout('monthly')}
          disabled={isLoading || !STRIPE_PRICES.monthly}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: '#111111',
            color: '#ededed',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {t('billing.monthlyPrice', { amount: PRICING.monthly.amount })}
        </button>
      </div>
    </div>
  );
};
