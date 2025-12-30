export const validateSubscriptionForm = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'validation.minLength';
  }
  if (data.name && data.name.length > 60) {
    errors.name = 'validation.maxLength';
  }

  if (!data.cost || data.cost < 0.01) {
    errors.cost = 'validation.minValue';
  }
  if (data.cost > 9999) {
    errors.cost = 'validation.maxValue';
  }

  if (!data.billingFrequency) {
    errors.billingFrequency = 'validation.required';
  }

  if (!data.nextPaymentDate) {
    errors.nextPaymentDate = 'validation.required';
  }

  if (data.providerUrl && !isValidUrl(data.providerUrl)) {
    errors.providerUrl = 'validation.invalidUrl';
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'validation.maxLength';
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
