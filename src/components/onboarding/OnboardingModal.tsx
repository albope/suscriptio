import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FREE_TIER_MAX_SUBSCRIPTIONS, PREMIUM_PRICE } from '@/constants/billing';
import { SUBSCRIPTION_TEMPLATES } from '@/constants/templates';

interface OnboardingModalProps {
  onClose: () => void;
  onAddSubscription: () => void;
}

const STEPS = 4;

export const OnboardingModal = ({ onClose, onAddSubscription }: OnboardingModalProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS - 1) {
      setStep(step + 1);
    } else {
      onClose();
      onAddSubscription();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleTemplateSelect = () => {
    onClose();
    onAddSubscription();
  };

  const steps = [
    {
      icon: (
        <svg style={{ width: '48px', height: '48px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('onboarding.step1Title'),
      description: t('onboarding.step1Description'),
    },
    {
      icon: (
        <svg style={{ width: '48px', height: '48px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
      title: t('onboarding.step2Title'),
      description: t('onboarding.step2Description'),
    },
    {
      icon: (
        <svg style={{ width: '48px', height: '48px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: t('onboarding.popularServices'),
      description: t('onboarding.quickAdd'),
      templates: true,
    },
    {
      icon: (
        <svg style={{ width: '48px', height: '48px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('onboarding.step3Title', { max: FREE_TIER_MAX_SUBSCRIPTIONS }),
      description: t('onboarding.step3Description', {
        max: FREE_TIER_MAX_SUBSCRIPTIONS,
        price: PREMIUM_PRICE.amount,
      }),
    },
  ];

  const current = steps[step];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && handleSkip()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          borderRadius: '20px',
          padding: '40px 32px 32px',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(0, 212, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? '#00d4ff' : i < step ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.15)',
          }}
        >
          {current.icon}
        </div>

        {/* Content */}
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#ededed',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          {current.title}
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            lineHeight: 1.6,
            marginBottom: current.templates ? '20px' : '32px',
          }}
        >
          {current.description}
        </p>

        {/* Templates grid */}
        {current.templates && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {SUBSCRIPTION_TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => handleTemplateSelect()}
                style={{
                  padding: '12px 10px',
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.12)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ededed', marginBottom: '2px' }}>
                  {tpl.name}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {tpl.cost.toFixed(2)} {tpl.currency}/{tpl.billingFrequency === 'monthly' ? t('subscriptions.frequency.perMonth').replace('/ ', '') : t('subscriptions.frequency.perYear').replace('/ ', '')}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
              color: '#000',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 0 16px rgba(0, 212, 255, 0.25)',
            }}
          >
            {current.templates ? t('onboarding.orAddCustom') : step < STEPS - 1 ? t('onboarding.next') : t('onboarding.addFirst')}
          </button>
          <button
            onClick={handleSkip}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#666',
              fontWeight: 500,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('onboarding.skip')}
          </button>
        </div>
      </div>
    </div>
  );
};
