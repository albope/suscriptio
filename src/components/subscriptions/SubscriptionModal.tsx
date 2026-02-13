import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { SubscriptionForm } from './SubscriptionForm';
import { TemplatePicker } from './TemplatePicker';
import { UpgradePrompt } from '@/components/billing/UpgradePrompt';
import { Subscription, SubscriptionStatus, BillingFrequency } from '@/types';
import { SubscriptionTemplate } from '@/constants/templates';
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

  const [showPicker, setShowPicker] = useState(isNewSubscription && !showUpgrade);
  const [templateData, setTemplateData] = useState<Partial<Subscription> | undefined>();

  // Reset picker state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowPicker(isNewSubscription && !showUpgrade);
      setTemplateData(undefined);
    }
  }, [isOpen, isNewSubscription, showUpgrade]);

  const handleSelectTemplate = (template: SubscriptionTemplate) => {
    setTemplateData({
      name: template.name,
      cost: template.cost,
      currency: template.currency,
      billingFrequency: template.billingFrequency as BillingFrequency,
      category: template.category,
      status: SubscriptionStatus.ACTIVE,
      nextPaymentDate: new Date(),
    });
    setShowPicker(false);
  };

  const handleCustom = () => {
    setTemplateData(undefined);
    setShowPicker(false);
  };

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

  const getTitle = () => {
    if (showUpgrade) return t('billing.upgradeRequired');
    if (subscription) return t('subscriptions.edit');
    if (showPicker) return t('subscriptions.templates.title');
    return t('subscriptions.add');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {showUpgrade ? (
        <UpgradePrompt />
      ) : showPicker ? (
        <TemplatePicker onSelectTemplate={handleSelectTemplate} onCustom={handleCustom} />
      ) : (
        <SubscriptionForm
          initialData={subscription || templateData as Subscription | undefined}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
};
