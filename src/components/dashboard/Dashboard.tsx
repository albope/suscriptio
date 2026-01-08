import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { SpendOverview } from './SpendOverview';
import { KeyMetrics } from './KeyMetrics';
import { UpcomingPayments } from './UpcomingPayments';
import { CategoryBreakdown } from './CategoryBreakdown';
import { DashboardEmptyState } from './DashboardEmptyState';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { MigrationModal } from '@/components/auth/MigrationModal';
import { Subscription } from '@/types';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    subscriptions,
    activeSubscriptions,
    upcomingPayments,
    monthlySpend,
    yearlySpend,
    categoryBreakdown,
    mostExpensive,
    averageCost,
    subscriptionsByFrequency,
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 212, 255, 0.2)',
            borderTopColor: '#00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Header */}
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#ededed',
                  marginBottom: '8px',
                  letterSpacing: '-0.02em'
                }}>
                  {t('dashboard.title')}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg style={{ width: '16px', height: '16px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>{t('subscriptions.add')}</span>
              </button>
            </div>
          </div>

          {/* KPI Cards - 2x2 Grid */}
          <div className="animate-slide-up animate-delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <SpendOverview monthlySpend={monthlySpend} yearlySpend={yearlySpend} />
            <KeyMetrics
              activeCount={activeSubscriptions.length}
              mostExpensive={mostExpensive}
              averageCost={averageCost}
              subscriptionsByFrequency={subscriptionsByFrequency}
            />
          </div>

          {/* Content Grid */}
          <div className="animate-slide-up animate-delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <UpcomingPayments
              subscriptions={upcomingPayments}
              onSubscriptionClick={handleSubscriptionClick}
            />
            <CategoryBreakdown data={categoryBreakdown} />
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
