import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsPremium } from '@/hooks/useIsPremium';
import { PricingModal } from './PricingModal';
import type { PremiumFeature } from '@/types/billing';

interface PremiumGateProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  fallback?: 'blur' | 'lock' | 'hidden' | 'inline-prompt';
}

export const PremiumGate = ({ feature, children, fallback = 'blur' }: PremiumGateProps) => {
  const isPremium = useIsPremium();
  const { t } = useTranslation();
  const [showPricing, setShowPricing] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  const featureName = t(`premium.featureNames.${feature}`);

  if (fallback === 'hidden') {
    return null;
  }

  if (fallback === 'inline-prompt') {
    return (
      <>
        <button
          onClick={() => setShowPricing(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: 'rgba(255, 187, 0, 0.08)',
            border: '1px solid rgba(255, 187, 0, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontSize: '13px',
            color: '#ffbb00',
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {featureName} — Premium
        </button>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      </>
    );
  }

  if (fallback === 'lock') {
    return (
      <>
        <div
          style={{
            background: 'rgba(17, 17, 17, 0.6)',
            border: '1px solid rgba(255, 187, 0, 0.15)',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(255, 187, 0, 0.12) 0%, rgba(255, 140, 0, 0.08) 100%)',
              border: '1px solid rgba(255, 187, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffbb00"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ededed',
              marginBottom: '6px',
            }}
          >
            {featureName}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#888888',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            {t('premium.lockedDescription')}
          </p>
          <button
            onClick={() => setShowPricing(true)}
            style={{
              padding: '12px 24px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(180deg, #ffbb00 0%, #ff8c00 100%)',
              color: '#000',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 20px rgba(255, 187, 0, 0.2)',
            }}
          >
            {t('premium.unlockFeature')}
          </button>
        </div>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      </>
    );
  }

  // fallback === 'blur' (default)
  return (
    <>
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
        <div
          style={{
            filter: 'blur(6px)',
            opacity: 0.5,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {children}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255, 187, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)',
              border: '1px solid rgba(255, 187, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffbb00"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#ededed' }}>
            {featureName}
          </p>
          <button
            onClick={() => setShowPricing(true)}
            style={{
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(180deg, #ffbb00 0%, #ff8c00 100%)',
              color: '#000',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 16px rgba(255, 187, 0, 0.25)',
            }}
          >
            {t('premium.unlockFeature')}
          </button>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </>
  );
};
