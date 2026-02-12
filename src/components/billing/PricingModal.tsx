import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { FREE_TIER_MAX_SUBSCRIPTIONS, PREMIUM_PRICE } from '@/constants/billing';
import { useGooglePlayPurchase } from '@/hooks/useGooglePlayPurchase';
import { isAndroid } from '@/lib/platform';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { t } = useTranslation();
  const { purchase, isLoading, error } = useGooglePlayPurchase();

  const handlePurchase = async () => {
    const success = await purchase();
    if (success) {
      onClose();
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
      t('billing.features.permanentAccess'),
    ],
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('billing.upgrade')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Premium card */}
        <div
          style={{
            padding: '24px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 187, 0, 0.3)',
            background:
              'linear-gradient(180deg, rgba(255, 187, 0, 0.05) 0%, rgba(255, 140, 0, 0.02) 100%)',
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
            {t('billing.oneTimePurchase')}
          </span>
          <p
            style={{
              fontSize: '14px',
              color: '#888888',
              marginBottom: '8px',
              fontWeight: 500,
              marginTop: '8px',
            }}
          >
            Premium
          </p>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#ededed', marginBottom: '4px' }}>
            €{PREMIUM_PRICE.amount}
          </p>
          <p style={{ fontSize: '13px', color: '#ffbb00' }}>{t('billing.payOnce')}</p>
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '10px',
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
            {isLoading ? '...' : t('billing.unlockPremium')}
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
