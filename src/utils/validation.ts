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

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('validation.password.minLength');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('validation.password.uppercase');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('validation.password.lowercase');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('validation.password.number');
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (errors.length === 0) {
    strength = hasSpecialChar || password.length >= 12 ? 'strong' : 'medium';
  } else if (errors.length <= 2 && password.length >= 6) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
