import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { useSettingsStore } from '@/store/settingsStore';
import { SpendOverview } from './SpendOverview';
import { KeyMetrics } from './KeyMetrics';
import { CategoryBreakdown } from './CategoryBreakdown';
import { PaymentTimeline } from './PaymentTimeline';
import { CalendarView } from './CalendarView';
import { DashboardEmptyState } from './DashboardEmptyState';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { MigrationModal } from '@/components/auth/MigrationModal';
import { Subscription } from '@/types';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { paymentView, setPaymentView } = useSettingsStore();
  const {
    subscriptions,
    activeSubscriptions,
    categoryBreakdown,
    mostExpensive,
    averageCost,
    subscriptionsByFrequency,
    preferredCurrency,
    spendByCurrency,
    isLoading,
    migrateLocalToCloud,
    getLocalSubscriptions,
    clearSubscriptions,
  } = useSubscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();
  const [showMigration, setShowMigration] = useState(false);
  const [localDataCount, setLocalDataCount] = useState(0);

  // Check for local data to migrate after login
  useEffect(() => {
    if (user && !isLoading) {
      // Check if migration was already handled for this user
      const migrationKey = `migration-handled-${user.id}`;
      if (localStorage.getItem(migrationKey)) {
        return; // Migration already processed, skip
      }

      // Get data from localStorage directly (before it gets cleared)
      const stored = localStorage.getItem('subscriptions-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const localSubs = parsed.state?.subscriptions || [];
          if (localSubs.length > 0) {
            setLocalDataCount(localSubs.length);
            setShowMigration(true);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [user, isLoading]);

  const handleMigrate = async (): Promise<boolean> => {
    const localSubs = getLocalSubscriptions();
    const success = await migrateLocalToCloud(localSubs);
    if (success && user) {
      // Mark migration as handled for this user
      localStorage.setItem(`migration-handled-${user.id}`, 'true');
      // Clear local data after successful migration
      localStorage.removeItem('subscriptions-storage');
      setShowMigration(false);
    }
    return success ?? false;
  };

  const handleDiscardMigration = () => {
    if (user) {
      // Mark migration as handled for this user
      localStorage.setItem(`migration-handled-${user.id}`, 'true');
    }
    // Clear local data without migrating
    localStorage.removeItem('subscriptions-storage');
    clearSubscriptions();
    setShowMigration(false);
  };

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSubscription(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(undefined);
  };

  // Only show empty state if no subscriptions AND not loading
  // Use subscriptions.length as fallback to catch edge cases
  const hasSubscriptions = activeSubscriptions.length > 0 || subscriptions.length > 0;
  const isEmpty = !hasSubscriptions && !isLoading;

  return (
    <>
      {isEmpty ? (
        <DashboardEmptyState onAddSubscription={handleAddNew} />
      ) : isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 212, 255, 0.2)',
              borderTopColor: '#00d4ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      ) : (
        <div
          className="animate-fade-in"
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          {/* Header */}
          <div
            className="animate-slide-up"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#ededed',
                    marginBottom: '8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {t('dashboard.title')}
                </h1>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg
                    style={{ width: '16px', height: '16px', color: '#00d4ff' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Gestiona tus suscripciones en un solo lugar
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="premium-add-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 50%, #0090b0 100%)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `
                    0 0 0 1px rgba(0, 212, 255, 0.3),
                    0 4px 16px rgba(0, 212, 255, 0.25),
                    0 8px 32px -8px rgba(0, 212, 255, 0.4)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `
                    0 0 0 1px rgba(0, 212, 255, 0.5),
                    0 8px 24px rgba(0, 212, 255, 0.35),
                    0 12px 40px -8px rgba(0, 212, 255, 0.5)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `
                    0 0 0 1px rgba(0, 212, 255, 0.3),
                    0 4px 16px rgba(0, 212, 255, 0.25),
                    0 8px 32px -8px rgba(0, 212, 255, 0.4)
                  `;
                }}
              >
                <svg
                  style={{ width: '18px', height: '18px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('subscriptions.add')}</span>
              </button>
            </div>
          </div>

          {/* KPI Cards - 2x2 Grid */}
          <div
            className="animate-slide-up animate-delay-100"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            <SpendOverview spendByCurrency={spendByCurrency} />
            <KeyMetrics
              activeCount={activeSubscriptions.length}
              mostExpensive={mostExpensive}
              averageCost={averageCost}
              subscriptionsByFrequency={subscriptionsByFrequency}
              preferredCurrency={preferredCurrency}
            />
          </div>

          {/* Payment Visualization Section */}
          <div className="animate-slide-up animate-delay-200">
            {/* View Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#ededed',
                }}
              >
                {paymentView === 'timeline' ? t('timeline.title') : t('calendar.title')}
              </h2>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(17, 17, 17, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '4px',
                }}
              >
                <button
                  onClick={() => setPaymentView('timeline')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    background:
                      paymentView === 'timeline'
                        ? 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)'
                        : 'transparent',
                    color: paymentView === 'timeline' ? '#000' : '#888888',
                    boxShadow:
                      paymentView === 'timeline' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
                  }}
                >
                  <svg
                    style={{
                      width: '16px',
                      height: '16px',
                      display: 'inline',
                      marginRight: '6px',
                      verticalAlign: 'text-bottom',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {t('view.timeline')}
                </button>
                <button
                  onClick={() => setPaymentView('calendar')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    background:
                      paymentView === 'calendar'
                        ? 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)'
                        : 'transparent',
                    color: paymentView === 'calendar' ? '#000' : '#888888',
                    boxShadow:
                      paymentView === 'calendar' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
                  }}
                >
                  <svg
                    style={{
                      width: '16px',
                      height: '16px',
                      display: 'inline',
                      marginRight: '6px',
                      verticalAlign: 'text-bottom',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {t('view.calendar')}
                </button>
              </div>
            </div>

            {/* Views */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {paymentView === 'timeline' ? (
                <PaymentTimeline
                  subscriptions={activeSubscriptions}
                  onSubscriptionClick={handleSubscriptionClick}
                  daysToShow={60}
                />
              ) : (
                <CalendarView
                  subscriptions={activeSubscriptions}
                  onSubscriptionClick={handleSubscriptionClick}
                />
              )}
              <CategoryBreakdown data={categoryBreakdown} />
            </div>
          </div>
        </div>
      )}

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />

      {/* Migration Modal */}
      {showMigration && (
        <MigrationModal
          count={localDataCount}
          onMigrate={handleMigrate}
          onDiscard={handleDiscardMigration}
        />
      )}
    </>
  );
};
