import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SpendOverview } from './SpendOverview';
import { KeyMetrics } from './KeyMetrics';
import { UpcomingPayments } from './UpcomingPayments';
import { CategoryBreakdown } from './CategoryBreakdown';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { Subscription } from '@/types';

export const Dashboard = () => {
  const { t } = useTranslation();
  const {
    activeSubscriptions,
    upcomingPayments,
    monthlySpend,
    yearlySpend,
    categoryBreakdown,
    mostExpensive,
  } = useSubscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();

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
    </div>
  );
};
