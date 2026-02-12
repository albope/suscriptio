import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useSettingsStore } from '@/store/settingsStore';
import { useFilterPreferences } from '@/hooks/useFilterPreferences';
import { useTierLimits } from '@/hooks/useTierLimits';
import { applyAllFilters } from '@/utils/filterUtils';
import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionModal } from './SubscriptionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyState } from './EmptyState';
import { FilterBar } from './FilterBar';
import { PricingModal } from '@/components/billing/PricingModal';
import { Button } from '@/components/ui/Button';
import { Subscription, Category, TIER_LIMITS } from '@/types';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'name-asc';

export const SubscriptionList = () => {
  const { t } = useTranslation();

  // Sort options with translations
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date-asc', label: t('subscriptions.sortDateAsc') },
    { value: 'date-desc', label: t('subscriptions.sortDateDesc') },
    { value: 'price-desc', label: t('subscriptions.sortPriceDesc') },
    { value: 'price-asc', label: t('subscriptions.sortPriceAsc') },
    { value: 'name-asc', label: t('subscriptions.sortNameAsc') },
  ];
  const { subscriptions, undoDelete, getAllTags } = useSubscriptionStore();
  const { permanentDelete } = useSubscriptions();
  const { preferredCurrency } = useSettingsStore();
  const { preferences, updatePreferences, resetPreferences } = useFilterPreferences();
  const { tier, canAddSubscription, currentCount, remainingSlots } = useTierLimits();

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize from preferences
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'canceled'>(
    preferences.statusFilter
  );
  const [sortBy, setSortBy] = useState<SortOption>(preferences.sortBy);
  const [categoryFilters, setCategoryFilters] = useState<(Category | 'no-category')[]>(
    preferences.categoryFilters as (Category | 'no-category')[]
  );
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(preferences.priceRange);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: preferences.dateRange.from ? new Date(preferences.dateRange.from) : null,
    to: preferences.dateRange.to ? new Date(preferences.dateRange.to) : null,
  });

  // Sync state changes to preferences
  useEffect(() => {
    updatePreferences({
      statusFilter,
      sortBy,
      categoryFilters: categoryFilters as Category[],
      priceRange,
      dateRange: {
        from: dateRange.from ? dateRange.from.toISOString().split('T')[0] : null,
        to: dateRange.to ? dateRange.to.toISOString().split('T')[0] : null,
      },
    });
  }, [statusFilter, sortBy, categoryFilters, priceRange, dateRange, updatePreferences]);

  // Calculate active filters count (for FilterBar badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilters.length > 0) count++;
    if (tagFilters.length > 0) count++;
    if (priceRange.min !== null || priceRange.max !== null) count++;
    if (dateRange.from !== null || dateRange.to !== null) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [categoryFilters, tagFilters, priceRange, dateRange, searchQuery]);

  // Apply all filters using utility function
  const filteredSubscriptions = useMemo(() => {
    return applyAllFilters(subscriptions, {
      search: searchQuery,
      status: statusFilter,
      categories: categoryFilters,
      tags: tagFilters,
      priceRange,
      dateRange,
      currency: preferredCurrency,
    });
  }, [
    subscriptions,
    searchQuery,
    statusFilter,
    categoryFilters,
    tagFilters,
    priceRange,
    dateRange,
    preferredCurrency,
  ]);

  // Ordenar
  const sortedSubscriptions = useMemo(() => {
    const subs = [...filteredSubscriptions];
    switch (sortBy) {
      case 'date-asc':
        return subs.sort(
          (a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
        );
      case 'date-desc':
        return subs.sort(
          (a, b) => new Date(b.nextPaymentDate).getTime() - new Date(a.nextPaymentDate).getTime()
        );
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
    if (!canAddSubscription) {
      setIsPricingOpen(true);
      return;
    }
    setSelectedSubscription(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(undefined);
  };

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
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

    // Show toast with undo option
    toast.success(t('toasts.subscriptionDeleted'), {
      action: {
        label: t('toasts.undo'),
        onClick: () => {
          const restored = undoDelete();
          if (restored) {
            toast.success(t('toasts.undoSuccess'));
          }
        },
      },
      duration: 5000,
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilters([]);
    setTagFilters([]);
    setPriceRange({ min: null, max: null });
    setDateRange({ from: null, to: null });
    setStatusFilter('active');
    setSortBy('date-asc');
    resetPreferences();
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
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>
            {t('subscriptions.title')}
          </h1>
          <p style={{ fontSize: '14px', color: '#666666' }}>
            {sortedSubscriptions.length}{' '}
            {sortedSubscriptions.length === 1
              ? t('dashboard.subscription')
              : t('dashboard.subscriptions')}
            {tier === 'free' && (
              <span style={{ marginLeft: '8px', color: remainingSlots <= 1 ? '#ffbb00' : '#555555' }}>
                · {t('billing.subscriptionsUsed', { current: currentCount, max: TIER_LIMITS.free.maxActiveSubscriptions })}
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <svg
            style={{ width: '16px', height: '16px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('subscriptions.add')}
        </Button>
      </div>

      {/* Search + Sort Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#555555',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              style={{ width: '18px', height: '18px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('subscriptions.searchPlaceholder')}
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
              <svg
                style={{ width: '12px', height: '12px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
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
          <div
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#666666',
            }}
          >
            <svg
              style={{ width: '16px', height: '16px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Filter */}
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

      {/* Advanced Filters */}
      <FilterBar
        categories={categoryFilters}
        onCategoryChange={setCategoryFilters}
        tags={tagFilters}
        onTagsChange={setTagFilters}
        availableTags={getAllTags()}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        dateRange={{
          from: dateRange.from ? dateRange.from.toISOString().split('T')[0] : null,
          to: dateRange.to ? dateRange.to.toISOString().split('T')[0] : null,
        }}
        onDateRangeChange={(range) =>
          setDateRange({
            from: range.from ? new Date(range.from) : null,
            to: range.to ? new Date(range.to) : null,
          })
        }
        currency={preferredCurrency}
        onReset={handleResetFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Subscriptions Grid */}
      {sortedSubscriptions.length === 0 ? (
        activeFiltersCount > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center',
              background: 'rgba(17, 17, 17, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <svg
                style={{ width: '32px', height: '32px', color: '#666666' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#ededed',
                marginBottom: '8px',
              }}
            >
              {t('filters.noResults')}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#666666',
                marginBottom: '24px',
              }}
            >
              {t('filters.noResultsHint')}
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ededed',
                transition: 'all 0.15s ease',
              }}
            >
              {t('filters.clearAll')}
            </button>
          </div>
        ) : (
          <EmptyState filter={statusFilter} />
        )
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

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
};
