import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { SubscriptionForm } from './SubscriptionForm';
import { Subscription } from '@/types';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription;
}

export const SubscriptionModal = ({ isOpen, onClose, subscription }: SubscriptionModalProps) => {
  const { t } = useTranslation();
  const { addSubscription, updateSubscription } = useSubscriptions();

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
      title={subscription ? t('subscriptions.edit') : t('subscriptions.add')}
    >
      <SubscriptionForm initialData={subscription} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};
