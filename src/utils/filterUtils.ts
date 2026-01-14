import { Subscription, SubscriptionStatus, Category } from '@/types';
import { normalizeToMonthly } from './calculations';

/**
 * Filter subscriptions by search query (name)
 */
export function filterBySearch(
  subscriptions: Subscription[],
  query: string
): Subscription[] {
  if (!query.trim()) return subscriptions;
  const lowerQuery = query.toLowerCase();
  return subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter subscriptions by status
 */
export function filterByStatus(
  subscriptions: Subscription[],
  status: 'all' | 'active' | 'canceled'
): Subscription[] {
  if (status === 'all') return subscriptions;
  if (status === 'active') {
    return subscriptions.filter((sub) => sub.status === SubscriptionStatus.ACTIVE);
  }
  if (status === 'canceled') {
    return subscriptions.filter((sub) => sub.status === SubscriptionStatus.CANCELED);
  }
  return subscriptions;
}

/**
 * Filter subscriptions by multiple categories (OR logic)
 * Includes subscriptions without category if 'no-category' is in the filter
 */
export function filterByCategories(
  subscriptions: Subscription[],
  categories: (Category | 'no-category')[]
): Subscription[] {
  if (categories.length === 0) return subscriptions;

  return subscriptions.filter((sub) => {
    // Check if "no-category" is selected and subscription has no category
    if (categories.includes('no-category' as Category) && !sub.category) {
      return true;
    }
    // Check if subscription's category is in the selected categories
    return sub.category && categories.includes(sub.category);
  });
}

/**
 * Filter subscriptions by price range (normalized to monthly)
 * Only filters subscriptions in the specified currency
 */
export function filterByPriceRange(
  subscriptions: Subscription[],
  min: number | null,
  max: number | null,
  currency: string
): Subscription[] {
  if (min === null && max === null) return subscriptions;

  return subscriptions.filter((sub) => {
    // Only filter subscriptions in the specified currency
    if (sub.currency !== currency) return true;

    const monthlyCost = normalizeToMonthly(sub.cost, sub.billingFrequency);

    if (min !== null && monthlyCost < min) return false;
    if (max !== null && monthlyCost > max) return false;

    return true;
  });
}

/**
 * Filter subscriptions by date range (next payment date)
 */
export function filterByDateRange(
  subscriptions: Subscription[],
  from: Date | null,
  to: Date | null
): Subscription[] {
  if (from === null && to === null) return subscriptions;

  return subscriptions.filter((sub) => {
    const paymentDate = new Date(sub.nextPaymentDate);

    if (from !== null) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      if (paymentDate < fromDate) return false;
    }

    if (to !== null) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (paymentDate > toDate) return false;
    }

    return true;
  });
}

/**
 * Filter subscriptions by tags (OR logic)
 */
export function filterByTags(
  subscriptions: Subscription[],
  tags: string[]
): Subscription[] {
  if (tags.length === 0) return subscriptions;

  return subscriptions.filter((sub) => {
    if (!sub.tags || sub.tags.length === 0) return false;
    // Check if subscription has at least one of the selected tags
    return tags.some((tag) => sub.tags?.includes(tag));
  });
}

/**
 * Apply all filters in a chain
 */
export interface AllFilters {
  search?: string;
  status?: 'all' | 'active' | 'canceled';
  categories?: (Category | 'no-category')[];
  tags?: string[];
  priceRange?: { min: number | null; max: number | null };
  dateRange?: { from: Date | null; to: Date | null };
  currency?: string;
}

export function applyAllFilters(
  subscriptions: Subscription[],
  filters: AllFilters
): Subscription[] {
  let result = subscriptions;

  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }

  if (filters.status) {
    result = filterByStatus(result, filters.status);
  }

  if (filters.categories && filters.categories.length > 0) {
    result = filterByCategories(result, filters.categories);
  }

  if (filters.tags && filters.tags.length > 0) {
    result = filterByTags(result, filters.tags);
  }

  if (filters.priceRange && filters.currency) {
    result = filterByPriceRange(
      result,
      filters.priceRange.min,
      filters.priceRange.max,
      filters.currency
    );
  }

  if (filters.dateRange) {
    result = filterByDateRange(result, filters.dateRange.from, filters.dateRange.to);
  }

  return result;
}
