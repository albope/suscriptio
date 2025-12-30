import { useTranslation } from 'react-i18next';
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

  const handleSubmit = (data: any) => {
    if (subscription) {
      updateSubscription(subscription.id, data);
    } else {
      addSubscription(data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subscription ? t('subscriptions.edit') : t('subscriptions.add')}
    >
      <SubscriptionForm
        initialData={subscription}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
