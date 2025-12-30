import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionModal } from './SubscriptionModal';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { Subscription, SubscriptionStatus } from '@/types';

export const SubscriptionList = () => {
  const { t } = useTranslation();
  const { subscriptions } = useSubscriptionStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'canceled'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return sub.status === SubscriptionStatus.ACTIVE;
    if (statusFilter === 'canceled') return sub.status === SubscriptionStatus.CANCELED;
    return true;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort(
    (a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
  );

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

  const getFilterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    fontFamily: 'inherit',
    background: isActive ? 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)' : '#111111',
    color: isActive ? '#000' : '#888888',
    boxShadow: isActive ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none',
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>{t('subscriptions.title')}</h1>
          <p style={{ fontSize: '14px', color: '#666666' }}>
            {sortedSubscriptions.length} {sortedSubscriptions.length === 1 ? 'suscripción' : 'suscripciones'}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('subscriptions.add')}
        </Button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('active')}
          style={getFilterButtonStyle(statusFilter === 'active')}
        >
          {t('subscriptions.filterActive')}
        </button>
        <button
          onClick={() => setStatusFilter('canceled')}
          style={getFilterButtonStyle(statusFilter === 'canceled')}
        >
          {t('subscriptions.filterCanceled')}
        </button>
        <button
          onClick={() => setStatusFilter('all')}
          style={getFilterButtonStyle(statusFilter === 'all')}
        >
          {t('subscriptions.filterAll')}
        </button>
      </div>

      {/* Subscriptions Grid */}
      {sortedSubscriptions.length === 0 ? (
        <EmptyState filter={statusFilter} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onClick={() => handleSubscriptionClick(sub)}
            />
          ))}
        </div>
      )}

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />
    </div>
  );
};
