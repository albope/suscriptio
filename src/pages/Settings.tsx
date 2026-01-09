import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { exportToJson, importFromJson } from '@/utils/exportImport';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CURRENCIES } from '@/constants/currencies';
import type { Subscription } from '@/types';

export const Settings = () => {
  const { t } = useTranslation();
  const { subscriptions, replaceAllSubscriptions, addMultipleSubscriptions } = useSubscriptionStore();
  const { preferredCurrency, setPreferredCurrency } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<Subscription[] | null>(null);

  const handleExport = () => {
    if (subscriptions.length === 0) {
      toast.warning(t('toasts.exportEmpty'));
      return;
    }
    exportToJson(subscriptions);
    toast.success(t('toasts.exportSuccess'));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJson(file);
      setPendingImport(imported);
      setImportModalOpen(true);
    } catch {
      toast.error(t('toasts.importError'));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReplaceAll = () => {
    if (pendingImport) {
      replaceAllSubscriptions(pendingImport);
      toast.success(t('toasts.importReplaced'));
    }
    setImportModalOpen(false);
    setPendingImport(null);
  };

  const handleAddToExisting = () => {
    if (pendingImport) {
      addMultipleSubscriptions(pendingImport);
      toast.success(t('toasts.importAdded', { count: pendingImport.length }));
    }
    setImportModalOpen(false);
    setPendingImport(null);
  };

  const handleCancelImport = () => {
    setImportModalOpen(false);
    setPendingImport(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#ededed',
          marginBottom: '32px',
        }}
      >
        {t('settings.title')}
      </h1>

      {/* Preferences Section */}
      <section
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#ededed',
            marginBottom: '8px',
          }}
        >
          {t('settings.preferencesSection')}
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#666666',
            marginBottom: '24px',
          }}
        >
          {t('settings.preferencesDescription')}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#ededed',
                marginBottom: '4px',
              }}
            >
              {t('settings.preferredCurrency')}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666' }}>
              {t('settings.preferredCurrencyDescription')}
            </p>
          </div>
          <Select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Data Management Section */}
      <section
        style={{
          background: 'rgba(17, 17, 17, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#ededed',
            marginBottom: '8px',
          }}
        >
          {t('settings.dataSection')}
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#666666',
            marginBottom: '24px',
          }}
        >
          {t('settings.dataDescription')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Export */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#ededed',
                  marginBottom: '4px',
                }}
              >
                {t('settings.export')}
              </h3>
              <p style={{ fontSize: '13px', color: '#666666' }}>
                {t('settings.exportDescription')}
              </p>
            </div>
            <Button onClick={handleExport} variant="secondary">
              <svg
                style={{ width: '16px', height: '16px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              JSON
            </Button>
          </div>

          {/* Import */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#ededed',
                  marginBottom: '4px',
                }}
              >
                {t('settings.import')}
              </h3>
              <p style={{ fontSize: '13px', color: '#666666' }}>
                {t('settings.importDescription')}
              </p>
            </div>
            <Button onClick={handleImportClick} variant="secondary">
              <svg
                style={{ width: '16px', height: '16px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Current data info */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: 'rgba(0, 212, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#00d4ff' }}>
            {subscriptions.length} {subscriptions.length === 1 ? 'suscripcion' : 'suscripciones'} guardadas localmente
          </p>
        </div>
      </section>

      {/* Import Confirmation Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={handleCancelImport}
        title={t('settings.importConfirmTitle')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '14px', color: '#888888' }}>
            {t('settings.importConfirmMessage')}
          </p>

          {pendingImport && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(0, 212, 255, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <p style={{ fontSize: '14px', color: '#00d4ff', fontWeight: 500 }}>
                {t('settings.subscriptionsCount', { count: pendingImport.length })}
              </p>
            </div>
          )}

          {/* Replace option */}
          <button
            onClick={handleReplaceAll}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#ef4444', marginBottom: '4px' }}>
              {t('settings.importReplace')}
            </span>
            <span style={{ fontSize: '13px', color: '#888888' }}>
              {t('settings.importReplaceDescription')}
            </span>
          </button>

          {/* Add option */}
          <button
            onClick={handleAddToExisting}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '16px',
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#00d4ff', marginBottom: '4px' }}>
              {t('settings.importAdd')}
            </span>
            <span style={{ fontSize: '13px', color: '#888888' }}>
              {t('settings.importAddDescription')}
            </span>
          </button>

          {/* Cancel */}
          <Button variant="secondary" onClick={handleCancelImport} style={{ width: '100%' }}>
            {t('common.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
