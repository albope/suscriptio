import { useSubscriptionStore } from '@/store/subscriptionStore';

/**
 * Clears all persisted Zustand stores from localStorage.
 * Call before or after account deletion.
 */
export function clearAllLocalData(): void {
  useSubscriptionStore.getState().clearSubscriptions();
  localStorage.removeItem('subscriptions-storage');
  localStorage.removeItem('suscriptio-settings');
  localStorage.removeItem('reminder-settings');
}
