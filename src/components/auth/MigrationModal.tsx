import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MigrationModalProps {
  count: number;
  onMigrate: () => Promise<boolean>;
  onDiscard: () => void;
}

export const MigrationModal = ({ count, onMigrate, onDiscard }: MigrationModalProps) => {
  const { t } = useTranslation();
  const [migrating, setMigrating] = useState(false);

  const handleMigrate = async () => {
    setMigrating(true);
    const success = await onMigrate();
    if (!success) {
      setMigrating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(139, 92, 246, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#ededed',
            marginBottom: '12px',
          }}
        >
          {t('migration.title')}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: '14px',
            color: '#888888',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          {t('migration.message', { count })}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onDiscard}
            disabled={migrating}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#888888',
              fontSize: '14px',
              fontWeight: 500,
              cursor: migrating ? 'not-allowed' : 'pointer',
              opacity: migrating ? 0.5 : 1,
            }}
          >
            {t('migration.discard')}
          </button>
          <button
            onClick={handleMigrate}
            disabled={migrating}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: migrating
                ? '#333333'
                : 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
              border: 'none',
              borderRadius: '10px',
              color: migrating ? '#666666' : '#000',
              fontSize: '14px',
              fontWeight: 600,
              cursor: migrating ? 'not-allowed' : 'pointer',
              boxShadow: migrating ? 'none' : '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            {migrating ? '...' : t('migration.migrate')}
          </button>
        </div>
      </div>
    </div>
  );
};
