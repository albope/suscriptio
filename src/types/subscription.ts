export enum BillingFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
}

export enum Category {
  STREAMING = 'streaming',
  PRODUCTIVITY = 'productivity',
  CLOUD_STORAGE = 'cloud_storage',
  MUSIC = 'music',
  GAMING = 'gaming',
  HEALTH_FITNESS = 'health_fitness',
  NEWS_LEARNING = 'news_learning',
  UTILITIES = 'utilities',
  OTHER = 'other',
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingFrequency: BillingFrequency;
  nextPaymentDate: Date;
  status: SubscriptionStatus;
  category?: Category;
  notes?: string;
  providerUrl?: string;
  reminderDaysBefore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyAmount {
  currency: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  totalsByCurrency: CurrencyAmount[];
}
