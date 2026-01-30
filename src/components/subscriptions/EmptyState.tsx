import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  filter?: 'all' | 'active' | 'canceled';
}

export const EmptyState = ({ filter = 'active' }: EmptyStateProps) => {
  const { t } = useTranslation();

  const getMessage = () => {
    switch (filter) {
      case 'canceled':
        return {
          title: t('subscriptions.emptyCanceled'),
          subtitle: t('subscriptions.emptyCanceledSubtitle'),
          icon: (
            <svg
              style={{ width: '32px', height: '32px', color: '#00ff94' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconBg: 'rgba(0, 255, 148, 0.1)',
          iconBorder: 'rgba(0, 255, 148, 0.2)',
        };
      case 'all':
        return {
          title: t('subscriptions.emptyAll'),
          subtitle: t('subscriptions.emptyAllSubtitle'),
          icon: (
            <svg
              style={{ width: '32px', height: '32px', color: '#00d4ff' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          iconBg: 'rgba(0, 212, 255, 0.1)',
          iconBorder: 'rgba(0, 212, 255, 0.2)',
        };
      case 'active':
      default:
        return {
          title: t('subscriptions.emptyActive'),
          subtitle: t('subscriptions.emptyActiveSubtitle'),
          icon: (
            <svg
              style={{ width: '32px', height: '32px', color: '#00d4ff' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          iconBg: 'rgba(0, 212, 255, 0.1)',
          iconBorder: 'rgba(0, 212, 255, 0.2)',
        };
    }
  };

  const message = getMessage();

  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        borderRadius: '16px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          background: message.iconBg,
          border: `1px solid ${message.iconBorder}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        {message.icon}
      </div>
      <p style={{ fontSize: '16px', fontWeight: 500, color: '#999999' }}>{message.title}</p>
      <p style={{ fontSize: '13px', color: '#666666', marginTop: '8px' }}>{message.subtitle}</p>
    </div>
  );
};
