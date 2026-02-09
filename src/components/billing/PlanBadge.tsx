import { useTranslation } from 'react-i18next';
import { SubscriptionTier } from '@/types/billing';

interface PlanBadgeProps {
  tier: SubscriptionTier;
}

export const PlanBadge = ({ tier }: PlanBadgeProps) => {
  const { t } = useTranslation();

  const styles: Record<SubscriptionTier, React.CSSProperties> = {
    free: {
      background: 'rgba(255, 255, 255, 0.06)',
      color: '#888888',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    premium: {
      background: 'linear-gradient(135deg, rgba(255, 187, 0, 0.15) 0%, rgba(255, 140, 0, 0.15) 100%)',
      color: '#ffbb00',
      border: '1px solid rgba(255, 187, 0, 0.3)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        fontSize: '10px',
        fontWeight: 700,
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...styles[tier],
      }}
    >
      {tier === 'premium' && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )}
      {t(`billing.${tier}`)}
    </span>
  );
};
