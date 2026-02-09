import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { Login } from './Login';

// Mock useAuth hook
const mockSignIn = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
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

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders login form with email and password inputs', () => {
      renderLogin();

      expect(screen.getByRole('heading', { name: /suscriptio/i })).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/password|contraseña/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /iniciar sesión|sign in|login/i })
      ).toBeInTheDocument();
    });

    it('renders link to register page', () => {
      renderLogin();

      const registerLink = screen.getByRole('link', {
        name: /crear cuenta|create account|register/i,
      });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('has email input of type email', () => {
      renderLogin();

      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('has password input of type password', () => {
      renderLogin();

      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls signIn with email and password on submit', async () => {
      mockSignIn.mockResolvedValue({ error: null });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('navigates to home on successful login', async () => {
      mockSignIn.mockResolvedValue({ error: null });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('displays error message for invalid credentials', async () => {
      mockSignIn.mockResolvedValue({
        error: { message: 'Invalid login credentials' },
      });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'WrongPassword');
      await user.click(submitButton);

      await waitFor(() => {
        // Error container should appear (has red background)
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('displays error message for network errors', async () => {
      mockSignIn.mockResolvedValue({
        error: { message: 'Network error' },
      });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        // Error container should appear
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      mockSignIn.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
    });
  });

  describe('error handling', () => {
    it('handles email not confirmed error', async () => {
      mockSignIn.mockResolvedValue({
        error: { message: 'Email not confirmed' },
      });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('handles rate limiting error', async () => {
      mockSignIn.mockResolvedValue({
        error: { message: 'Too many requests' },
      });
      renderLogin();
      const user = userEvent.setup();

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión|sign in|login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = document.querySelector('[style*="rgba(255, 68, 68"]');
        expect(errorContainer).toBeInTheDocument();
      });
    });
  });
});
