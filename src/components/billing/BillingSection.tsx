import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useGooglePlayPurchase } from '@/hooks/useGooglePlayPurchase';
import { isAndroid } from '@/lib/platform';
import { PlanBadge } from './PlanBadge';
import { PricingModal } from './PricingModal';

export const BillingSection = () => {
  const { t } = useTranslation();
  const { profile, isLoading } = useUserProfile();
  const { restore, isLoading: isRestoring } = useGooglePlayPurchase();
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const tier = profile?.subscriptionTier ?? 'free';
  const isPremium = tier === 'premium';

  if (isLoading) {
    return (
      <div
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '20px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            animation: 'pulse 1.5s infinite',
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#ededed',
            marginBottom: '20px',
          }}
        >
          {t('billing.planSection')}
        </h2>

        {/* Current plan */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isPremium
                  ? 'linear-gradient(135deg, rgba(255, 187, 0, 0.15), rgba(255, 140, 0, 0.1))'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isPremium
                  ? '1px solid rgba(255, 187, 0, 0.2)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPremium ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#ffbb00"
                  aria-hidden="true"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666666"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ededed' }}>
                  {t('billing.currentPlan')}
                </span>
                <PlanBadge tier={tier} />
              </div>
              {isPremium && (
                <p style={{ fontSize: '12px', color: '#888888', marginTop: '4px' }}>
                  {t('billing.permanentAccess')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isPremium ? (
          isAndroid() && (
            <button
              onClick={() => restore()}
              disabled={isRestoring}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#111111',
                color: '#ededed',
                cursor: isRestoring ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                opacity: isRestoring ? 0.6 : 1,
              }}
            >
              {isRestoring ? '...' : t('billing.restorePurchase')}
            </button>
          )
        ) : (
          <button
            onClick={() => setIsPricingOpen(true)}
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(180deg, #ffbb00 0%, #ff8c00 100%)',
              color: '#000',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 20px rgba(255, 187, 0, 0.25)',
            }}
          >
            {t('billing.upgrade')}
          </button>
        )}
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
};
