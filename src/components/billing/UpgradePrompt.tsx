import { useTranslation } from 'react-i18next';
import { FREE_TIER_MAX_SUBSCRIPTIONS, PREMIUM_PRICE } from '@/constants/billing';
import { useGooglePlayPurchase } from '@/hooks/useGooglePlayPurchase';
import { isAndroid } from '@/lib/platform';

export const UpgradePrompt = () => {
  const { t } = useTranslation();
  const { purchase, isLoading, error } = useGooglePlayPurchase();

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '32px 24px',
      }}
    >
      {/* Star icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background:
            'linear-gradient(135deg, rgba(255, 187, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)',
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

      {/* Single purchase button */}
      <button
        onClick={() => purchase()}
        disabled={isLoading}
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
        {isLoading
          ? '...'
          : t('billing.unlockPremiumPrice', { amount: PREMIUM_PRICE.amount })}
      </button>

      {!isAndroid() && (
        <p style={{ fontSize: '11px', color: '#666666', marginTop: '8px' }}>
          {t('billing.availableOnAndroid')}
        </p>
      )}

      {error && error !== 'PLATFORM_NOT_SUPPORTED' && (
        <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>{error}</p>
      )}
    </div>
  );
};
