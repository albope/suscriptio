import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { SpendOverview } from './SpendOverview';
import { KeyMetrics } from './KeyMetrics';
import { UpcomingPayments } from './UpcomingPayments';
import { CategoryBreakdown } from './CategoryBreakdown';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { MigrationModal } from '@/components/auth/MigrationModal';
import { Subscription } from '@/types';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    activeSubscriptions,
    upcomingPayments,
    monthlySpend,
    yearlySpend,
    categoryBreakdown,
    mostExpensive,
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
    if (success) {
      // Clear local data after successful migration
      localStorage.removeItem('subscriptions-storage');
      setShowMigration(false);
    }
    return success ?? false;
  };

  const handleDiscardMigration = () => {
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>
              {t('dashboard.title')}
            </h1>
            <p style={{ fontSize: '14px', color: '#888888', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: '16px', height: '16px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Gestiona tus suscripciones en un solo lugar
            </p>
          </div>
          <button onClick={handleAddNew} className="btn-primary">
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('subscriptions.add')}
          </button>
        </div>
      </div>

      {/* KPI Cards - 2x2 Grid */}
      <div className="animate-slide-up animate-delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <SpendOverview monthlySpend={monthlySpend} yearlySpend={yearlySpend} />
        <KeyMetrics activeCount={activeSubscriptions.length} mostExpensive={mostExpensive} />
      </div>

      {/* Content Grid */}
      <div className="animate-slide-up animate-delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <UpcomingPayments
          subscriptions={upcomingPayments}
          onSubscriptionClick={handleSubscriptionClick}
        />
        <CategoryBreakdown data={categoryBreakdown} />
      </div>

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

      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
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
      )}
    </div>
  );
};
