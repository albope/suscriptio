import { useTranslation } from 'react-i18next';

interface DashboardEmptyStateProps {
  onAddSubscription: () => void;
}

export const DashboardEmptyState = ({ onAddSubscription }: DashboardEmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          textAlign: 'center',
          padding: '48px 32px',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(17, 17, 17, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 8px 32px -4px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
            border: '2px solid rgba(0, 212, 255, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
          }}
        >
          <svg
            style={{
              width: '56px',
              height: '56px',
              color: '#00d4ff',
              filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.3))',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ededed',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          {t('dashboard.emptyTitle')}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          {t('dashboard.emptySubtitle')}
        </p>

        {/* CTA Button */}
        <button
          onClick={onAddSubscription}
          className="premium-add-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 50%, #0090b0 100%)',
            color: '#000',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `
              0 0 0 1px rgba(0, 212, 255, 0.3),
              0 4px 16px rgba(0, 212, 255, 0.25),
              0 8px 32px -8px rgba(0, 212, 255, 0.4)
            `,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = `
              0 0 0 1px rgba(0, 212, 255, 0.5),
              0 8px 24px rgba(0, 212, 255, 0.35),
              0 12px 40px -8px rgba(0, 212, 255, 0.5)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `
              0 0 0 1px rgba(0, 212, 255, 0.3),
              0 4px 16px rgba(0, 212, 255, 0.25),
              0 8px 32px -8px rgba(0, 212, 255, 0.4)
            `;
          }}
        >
          <svg
            style={{ width: '20px', height: '20px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('dashboard.emptyAction')}</span>
        </button>

        {/* Subtle hint */}
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.3)',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg
            style={{ width: '14px', height: '14px', color: '#00d4ff' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('dashboard.emptyHint')}
        </p>
      </div>
    </div>
  );
};
