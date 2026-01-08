import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionModal } from './SubscriptionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { Subscription, SubscriptionStatus } from '@/types';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'name-asc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-asc', label: 'Fecha (próximas primero)' },
  { value: 'date-desc', label: 'Fecha (lejanas primero)' },
  { value: 'price-desc', label: 'Precio (mayor a menor)' },
  { value: 'price-asc', label: 'Precio (menor a mayor)' },
  { value: 'name-asc', label: 'Nombre (A-Z)' },
];

export const SubscriptionList = () => {
  const { t } = useTranslation();
  const { subscriptions } = useSubscriptionStore();
  const { permanentDelete } = useSubscriptions();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'canceled'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtrar por búsqueda
  const searchedSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const query = searchQuery.toLowerCase();
    return subscriptions.filter(sub =>
      sub.name.toLowerCase().includes(query)
    );
  }, [subscriptions, searchQuery]);

  // Filtrar por estado
  const filteredSubscriptions = useMemo(() => {
    return searchedSubscriptions.filter((sub) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return sub.status === SubscriptionStatus.ACTIVE;
      if (statusFilter === 'canceled') return sub.status === SubscriptionStatus.CANCELED;
      return true;
    });
  }, [searchedSubscriptions, statusFilter]);

  // Ordenar
  const sortedSubscriptions = useMemo(() => {
    const subs = [...filteredSubscriptions];
    switch (sortBy) {
      case 'date-asc':
        return subs.sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
      case 'date-desc':
        return subs.sort((a, b) => new Date(b.nextPaymentDate).getTime() - new Date(a.nextPaymentDate).getTime());
      case 'price-asc':
        return subs.sort((a, b) => a.cost - b.cost);
      case 'price-desc':
        return subs.sort((a, b) => b.cost - a.cost);
      case 'name-asc':
        return subs.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return subs;
    }
  }, [filteredSubscriptions, sortBy]);

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

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setSubscriptionToDelete(sub);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!subscriptionToDelete) return;
    setIsDeleting(true);
    await permanentDelete(subscriptionToDelete.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
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

      {/* Search + Sort Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#555555',
            display: 'flex',
            alignItems: 'center',
          }}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar suscripción..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 44px',
              background: 'rgba(17, 17, 17, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#ededed',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#888888',
              }}
            >
              <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: '12px 40px 12px 14px',
              background: 'rgba(17, 17, 17, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#ededed',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              minWidth: '200px',
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} style={{ background: '#111111' }}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#666666',
          }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
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
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        subscriptionName={subscriptionToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
