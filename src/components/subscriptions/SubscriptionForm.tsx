import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TagInput } from '@/components/ui/TagInput';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { BillingFrequency, SubscriptionStatus, Category, Subscription } from '@/types';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currencies';
import { PremiumGate } from '@/components/billing/PremiumGate';
import { useIsPremium } from '@/hooks/useIsPremium';
import { findService } from '@/utils/serviceMatch';

interface SubscriptionFormProps {
  initialData?: Subscription;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SubscriptionForm = ({ initialData, onSubmit, onCancel }: SubscriptionFormProps) => {
  const { t } = useTranslation();
  const { getAllTags } = useSubscriptionStore();
  const isPremium = useIsPremium();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    cost: initialData?.cost?.toString() || '',
    currency: initialData?.currency || DEFAULT_CURRENCY,
    billingFrequency: initialData?.billingFrequency || BillingFrequency.MONTHLY,
    customIntervalDays: initialData?.customIntervalDays?.toString() || '14',
    nextPaymentDate: initialData?.nextPaymentDate
      ? new Date(initialData.nextPaymentDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: initialData?.status || SubscriptionStatus.ACTIVE,
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    notes: initialData?.notes || '',
    providerUrl: initialData?.providerUrl || '',
    color: initialData?.color || undefined as string | undefined,
    isTrial: !!(initialData?.trialEndDate),
    trialEndDate: initialData?.trialEndDate
      ? new Date(initialData.trialEndDate).toISOString().split('T')[0]
      : '',
  });

  const suggestedColor = findService(formData.name)?.brandColor;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      cost: parseFloat(formData.cost),
      currency: formData.currency,
      billingFrequency: formData.billingFrequency,
      nextPaymentDate: new Date(formData.nextPaymentDate),
      status: formData.status,
      category: formData.category || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      notes: formData.notes || undefined,
      providerUrl: formData.providerUrl || undefined,
      customIntervalDays: formData.billingFrequency === BillingFrequency.CUSTOM
        ? parseInt(formData.customIntervalDays) || 14
        : undefined,
      color: formData.color || undefined,
      trialEndDate: formData.isTrial && formData.trialEndDate
        ? new Date(formData.trialEndDate)
        : undefined,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <Input
        label={t('subscriptions.fields.name')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        minLength={2}
        maxLength={60}
      />

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}
      >
        <Input
          label={t('subscriptions.fields.cost')}
          type="number"
          step="0.01"
          min="0.01"
          max="9999"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          required
        />
        <Select
          label={t('subscriptions.fields.currency')}
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          required
          disabled={!isPremium}
        >
          {isPremium ? (
            CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </option>
            ))
          ) : (
            <option value={formData.currency}>
              {CURRENCIES.find((c) => c.code === formData.currency)?.symbol || '€'} {formData.currency}
            </option>
          )}
        </Select>
      </div>

      <Select
        label={t('subscriptions.fields.billingFrequency')}
        value={formData.billingFrequency}
        onChange={(e) =>
          setFormData({ ...formData, billingFrequency: e.target.value as BillingFrequency })
        }
        required
      >
        <option value={BillingFrequency.MONTHLY}>{t('subscriptions.frequency.monthly')}</option>
        <option value={BillingFrequency.YEARLY}>{t('subscriptions.frequency.yearly')}</option>
        {isPremium && (
          <>
            <option value={BillingFrequency.WEEKLY}>{t('subscriptions.frequency.weekly')}</option>
            <option value={BillingFrequency.QUARTERLY}>{t('subscriptions.frequency.quarterly')}</option>
            <option value={BillingFrequency.CUSTOM}>{t('subscriptions.frequency.custom')}</option>
          </>
        )}
      </Select>

      {formData.billingFrequency === BillingFrequency.CUSTOM && (
        <Input
          label={t('subscriptions.frequency.customInterval')}
          type="number"
          min="1"
          max="365"
          value={formData.customIntervalDays}
          onChange={(e) => setFormData({ ...formData, customIntervalDays: e.target.value })}
          required
        />
      )}

      <Input
        label={t('subscriptions.fields.nextPaymentDate')}
        type="date"
        value={formData.nextPaymentDate}
        onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
        required
      />

      <Select
        label={t('subscriptions.fields.status')}
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as SubscriptionStatus })}
        required
      >
        <option value={SubscriptionStatus.ACTIVE}>{t('subscriptions.status.active')}</option>
        <option value={SubscriptionStatus.CANCELED}>{t('subscriptions.status.canceled')}</option>
      </Select>

      <Select
        label={t('subscriptions.fields.category')}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
      >
        <option value="">--</option>
        {Object.values(Category).map((cat) => (
          <option key={cat} value={cat}>
            {t(`subscriptions.categories.${cat}`)}
          </option>
        ))}
      </Select>

      {isPremium ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#888888',
            }}
          >
            {t('subscriptions.fields.tags')}
          </label>
          <TagInput
            tags={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            suggestions={getAllTags()}
            placeholder={t('tags.placeholder')}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#888888',
            }}
          >
            {t('subscriptions.fields.tags')}
          </label>
          <PremiumGate feature="tags" fallback="inline-prompt">
            <span />
          </PremiumGate>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#888888',
          }}
        >
          {t('subscriptions.fields.notes')}
        </label>
        <textarea
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#ededed',
            backgroundColor: '#111111',
            transition: 'all 0.15s ease',
            outline: 'none',
            resize: 'vertical',
            minHeight: '80px',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00d4ff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          maxLength={500}
          rows={3}
        />
      </div>

      <Input
        label={t('subscriptions.fields.providerUrl')}
        type="url"
        value={formData.providerUrl}
        onChange={(e) => setFormData({ ...formData, providerUrl: e.target.value })}
      />

      {/* Color picker */}
      <ColorPicker
        value={formData.color}
        onChange={(color) => setFormData({ ...formData, color })}
        suggestedColor={suggestedColor}
      />

      {/* Trial toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#888888' }}>
            {t('trial.toggle', 'Prueba gratuita')}
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={formData.isTrial}
            onClick={() => setFormData({ ...formData, isTrial: !formData.isTrial, trialEndDate: '' })}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s ease',
              background: formData.isTrial
                ? 'rgba(0, 212, 255, 0.4)'
                : 'rgba(255, 255, 255, 0.1)',
              padding: 0,
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: formData.isTrial ? '#00d4ff' : '#888888',
                position: 'absolute',
                top: '3px',
                left: formData.isTrial ? '23px' : '3px',
                transition: 'all 0.2s ease',
              }}
            />
          </button>
        </div>
        {formData.isTrial && (
          <>
            <Input
              label={t('trial.endDate', 'Fecha fin del trial')}
              type="date"
              value={formData.trialEndDate}
              onChange={(e) => setFormData({ ...formData, trialEndDate: e.target.value })}
              required
            />
            <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
              {t('trial.helper', 'Te avisaremos antes de que termine')}
            </p>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          marginTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">{t('common.save')}</Button>
      </div>
    </form>
  );
};
