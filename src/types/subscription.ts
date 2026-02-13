export enum BillingFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
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
  tags?: string[];
  notes?: string;
  providerUrl?: string;
  reminderDaysBefore?: number;
  customIntervalDays?: number;
  color?: string;
  trialEndDate?: Date;
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
