import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Subscription } from '@/types';
import { ServiceLogo } from '@/components/ui/ServiceLogo';
import { getTrialDaysRemaining } from '@/utils/dateUtils';

interface TrialAlertsProps {
  subscriptions: Subscription[];
  onClickSubscription?: (sub: Subscription) => void;
}

export const TrialAlerts = ({ subscriptions, onClickSubscription }: TrialAlertsProps) => {
  const { t } = useTranslation();

  const expiringTrials = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        if (!sub.trialEndDate) return false;
        const days = getTrialDaysRemaining(sub.trialEndDate);
        return days >= 0 && days <= 7;
      })
      .sort((a, b) => {
        const daysA = getTrialDaysRemaining(a.trialEndDate!);
        const daysB = getTrialDaysRemaining(b.trialEndDate!);
        return daysA - daysB;
      });
  }, [subscriptions]);

  if (expiringTrials.length === 0) return null;

  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        borderRadius: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <svg
          style={{ width: '16px', height: '16px', color: '#f59e0b' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b', margin: 0 }}>
          {t('trial.alertTitle', 'Trials por expirar')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {expiringTrials.map((sub) => {
          const days = getTrialDaysRemaining(sub.trialEndDate!);
          const isUrgent = days <= 3;

          return (
            <div
              key={sub.id}
              onClick={() => onClickSubscription?.(sub)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onClickSubscription?.(sub);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: '10px',
                cursor: onClickSubscription ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
            >
              <ServiceLogo name={sub.name} size={32} category={sub.category} brandColor={sub.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ededed' }}>
                  {sub.name}
                </div>
                <div style={{ fontSize: '12px', color: isUrgent ? '#ef4444' : '#f59e0b', fontWeight: 500 }}>
                  {days === 0
                    ? t('trial.expiringToday', 'Trial expira hoy')
                    : days === 1
                      ? t('trial.expiringTomorrow', 'Trial expira mañana')
                      : t('trial.daysRemaining', { days, defaultValue: `${days} días de trial` })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
