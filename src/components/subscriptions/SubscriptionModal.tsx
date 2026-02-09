import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { SubscriptionForm } from './SubscriptionForm';
import { UpgradePrompt } from '@/components/billing/UpgradePrompt';
import { Subscription } from '@/types';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useTierLimits } from '@/hooks/useTierLimits';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription;
}

export const SubscriptionModal = ({ isOpen, onClose, subscription }: SubscriptionModalProps) => {
  const { t } = useTranslation();
  const { addSubscription, updateSubscription } = useSubscriptions();
  const { canAddSubscription } = useTierLimits();

  const isNewSubscription = !subscription;
  const showUpgrade = isNewSubscription && !canAddSubscription;

  const handleSubmit = async (data: any) => {
    try {
      if (subscription) {
        await updateSubscription(subscription.id, data);
        toast.success(t('toasts.subscriptionUpdated'));
      } else {
        await addSubscription(data);
        toast.success(t('toasts.subscriptionCreated'));
      }
      onClose();
    } catch (error) {
      toast.error(t('subscriptions.saveError'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showUpgrade ? t('billing.upgradeRequired') : subscription ? t('subscriptions.edit') : t('subscriptions.add')}
    >
      {showUpgrade ? (
        <UpgradePrompt />
      ) : (
        <SubscriptionForm initialData={subscription} onSubmit={handleSubmit} onCancel={onClose} />
      )}
    </Modal>
  );
};
