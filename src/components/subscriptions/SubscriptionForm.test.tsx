import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { SubscriptionForm } from './SubscriptionForm';
import { BillingFrequency, SubscriptionStatus, Category } from '@/types';

// Mock subscription store
vi.mock('@/store/subscriptionStore', () => ({
  useSubscriptionStore: () => ({
    getAllTags: () => ['streaming', 'software', 'fitness'],
  }),
}));

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

const renderForm = (initialData?: Parameters<typeof SubscriptionForm>[0]['initialData']) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <SubscriptionForm initialData={initialData} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    </I18nextProvider>
  );
};

// Helper to get form inputs - the first input without a type is the name field
const getNameInput = () => {
  const inputs = document.querySelectorAll('input');
  // Name input is the first one without a specific type (or type=text which may not show)
  return Array.from(inputs).find(
    (input) => !input.type || input.type === 'text'
  ) as HTMLInputElement;
};

const getCostInput = () => document.querySelector('input[type="number"]') as HTMLInputElement;
const getDateInput = () => document.querySelector('input[type="date"]') as HTMLInputElement;
const getUrlInput = () => document.querySelector('input[type="url"]') as HTMLInputElement;

describe('SubscriptionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all form fields', () => {
      renderForm();

      // Check for inputs
      const inputs = document.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);

      // Check for select fields (billing frequency, status, category, currency)
      const selects = document.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(4);

      // Check for submit and cancel buttons
      expect(screen.getByRole('button', { name: /save|guardar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel|cancelar/i })).toBeInTheDocument();
    });

    it('renders with default values for new subscription', () => {
      renderForm();

      const nameInput = getNameInput();
      expect(nameInput).toBeInTheDocument();
      expect(nameInput.value).toBe('');

      const costInput = getCostInput();
      expect(costInput.value).toBe('');
    });

    it('renders with initial data when editing', () => {
      const initialData = {
        id: '1',
        name: 'Netflix',
        cost: 15.99,
        currency: 'EUR',
        billingFrequency: BillingFrequency.MONTHLY,
        nextPaymentDate: new Date('2025-02-15'),
        status: SubscriptionStatus.ACTIVE,
        category: Category.STREAMING,
        tags: ['streaming'],
        notes: 'Family plan',
        providerUrl: 'https://netflix.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      renderForm(initialData);

      const nameInput = getNameInput();
      expect(nameInput.value).toBe('Netflix');

      const costInput = getCostInput();
      expect(costInput.value).toBe('15.99');

      const urlInput = getUrlInput();
      expect(urlInput.value).toBe('https://netflix.com');
    });
  });

  describe('form structure', () => {
    it('has submit button of type submit', () => {
      renderForm();

      const submitButton = screen.getByRole('button', { name: /save|guardar/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('has cancel button of type button (not submit)', () => {
      renderForm();

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      expect(cancelButton).toHaveAttribute('type', 'button');
    });

    it('renders form element that wraps all inputs', () => {
      renderForm();

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      // All inputs should be inside the form
      const inputs = form?.querySelectorAll('input, select, textarea');
      expect(inputs?.length).toBeGreaterThan(0);
    });
  });

  describe('form cancellation', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      renderForm();
      const user = userEvent.setup();

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onSubmit when cancel is clicked', async () => {
      renderForm();
      const user = userEvent.setup();

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      await user.click(cancelButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    it('has name field with required and minlength attributes', () => {
      renderForm();

      const nameInput = getNameInput();
      expect(nameInput).toHaveAttribute('required');
      expect(nameInput).toHaveAttribute('minlength', '2');
    });

    it('has cost field with required and min attributes', () => {
      renderForm();

      const costInput = getCostInput();
      expect(costInput).toHaveAttribute('required');
      expect(costInput).toHaveAttribute('min', '0.01');
    });

    it('has date field with required attribute', () => {
      renderForm();

      const dateInput = getDateInput();
      expect(dateInput).toHaveAttribute('required');
    });
  });

  describe('editing existing subscription', () => {
    it('preserves original data when form is pre-filled', () => {
      const initialData = {
        id: '1',
        name: 'HBO Max',
        cost: 12.99,
        currency: 'USD',
        billingFrequency: BillingFrequency.YEARLY,
        nextPaymentDate: new Date('2025-06-01'),
        status: SubscriptionStatus.CANCELED,
        category: Category.STREAMING,
        tags: ['entertainment'],
        notes: 'Will cancel next year',
        providerUrl: 'https://hbomax.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      renderForm(initialData);

      const nameInput = getNameInput();
      const costInput = getCostInput();

      expect(nameInput.value).toBe('HBO Max');
      expect(costInput.value).toBe('12.99');
    });
  });
});
