import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { Register } from './Register';

// Mock useAuth hook
const mockSignUp = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Register />
      </I18nextProvider>
    </BrowserRouter>
  );
};

// Helper to get form inputs
const getEmailInput = () => document.querySelector('input[type="email"]') as HTMLInputElement;
const getPasswordInputs = () =>
  document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>;

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders register form with email and password fields', () => {
      renderRegister();

      expect(screen.getByRole('heading', { name: /suscriptio/i })).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      // Check for password labels
      const passwordLabels = screen.getAllByText(/password|contraseña/i);
      expect(passwordLabels.length).toBeGreaterThanOrEqual(2);
    });

    it('renders link to login page', () => {
      renderRegister();

      const loginLink = screen.getByRole('link', { name: /iniciar sesión|sign in|login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('has email input of type email', () => {
      renderRegister();
      expect(getEmailInput()).toBeInTheDocument();
    });

    it('has two password inputs', () => {
      renderRegister();
      const passwordInputs = getPasswordInputs();
      expect(passwordInputs.length).toBe(2);
    });
  });

  describe('password strength indicator', () => {
    it('shows password strength indicator when typing', async () => {
      renderRegister();
      const user = userEvent.setup();

      const passwordInput = getPasswordInputs()[0];
      await user.type(passwordInput, 'weak');

      await waitFor(() => {
        expect(screen.getByText(/débil|weak/i)).toBeInTheDocument();
      });
    });

    it('shows medium strength for password with some requirements', async () => {
      renderRegister();
      const user = userEvent.setup();

      const passwordInput = getPasswordInputs()[0];
      await user.type(passwordInput, 'password1');

      await waitFor(() => {
        expect(screen.getByText(/media|medium/i)).toBeInTheDocument();
      });
    });

    it('shows strong strength for complete password', async () => {
      renderRegister();
      const user = userEvent.setup();

      const passwordInput = getPasswordInputs()[0];
      await user.type(passwordInput, 'Password123!');

      await waitFor(() => {
        expect(screen.getByText(/fuerte|strong/i)).toBeInTheDocument();
      });
    });

    it('shows password requirement checklist', async () => {
      renderRegister();
      const user = userEvent.setup();

      const passwordInput = getPasswordInputs()[0];
      await user.type(passwordInput, 'p');

      await waitFor(() => {
        // Should show requirement checklist items (8 characters minimum)
        expect(screen.getByText(/8 char|8 car|mínimo/i)).toBeInTheDocument();
      });
    });
  });

  describe('form validation', () => {
    it('validates email format on form', () => {
      renderRegister();

      // Email input should have type="email" for browser validation
      const emailInput = getEmailInput();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('shows error when passwords do not match', async () => {
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password456');
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('shows password strength indicator for weak password', async () => {
      renderRegister();
      const user = userEvent.setup();

      const passwordInput = getPasswordInputs()[0];
      await user.type(passwordInput, 'weak');

      // Weak password should show weak indicator
      await waitFor(() => {
        expect(screen.getByText(/débil|weak/i)).toBeInTheDocument();
      });
    });

    it('prevents submission when signUp is not called for invalid form', async () => {
      renderRegister();
      const user = userEvent.setup();

      // Try to submit without filling form
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.click(submitButton);

      // signUp should not have been called due to HTML5 validation
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    it('calls signUp with email and password', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: '123' }, session: { access_token: 'token' } },
        error: null,
      });
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('navigates to home on successful registration with session', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: '123' }, session: { access_token: 'token' } },
        error: null,
      });
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows confirmation message when email verification is required', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: '123', identities: [{}] }, session: null },
        error: null,
      });
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        // Success message should appear (cyan/blue background)
        const successContainer = document.querySelector('[style*="rgba(0, 212, 255"]');
        expect(successContainer).toBeInTheDocument();
      });
    });

    it('displays error message when email is already in use', async () => {
      mockSignUp.mockResolvedValue({
        error: { message: 'User already registered' },
        data: null,
      });
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      mockSignUp.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: { user: { id: '123' }, session: { access_token: 'token' } },
                  error: null,
                }),
              100
            )
          )
      );
      renderRegister();
      const user = userEvent.setup();

      const emailInput = getEmailInput();
      const passwordInputs = getPasswordInputs();
      const submitButton = screen.getByRole('button', {
        name: /crear cuenta|create account|register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });
});
