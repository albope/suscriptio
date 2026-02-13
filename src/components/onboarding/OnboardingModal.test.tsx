import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { OnboardingModal } from './OnboardingModal';

describe('OnboardingModal', () => {
  const onClose = vi.fn();
  const onAddSubscription = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step on mount', () => {
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );
    expect(screen.getByText('Welcome to Suscriptio')).toBeInTheDocument();
  });

  it('advances to step 2 on next click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );

    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Add your subscriptions')).toBeInTheDocument();
  });

  it('advances to step 3 (templates) on second next click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Popular services')).toBeInTheDocument();
  });

  it('advances to step 4 on third next click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('or add custom'));
    expect(screen.getByText(/Free up to 3 subscriptions/)).toBeInTheDocument();
  });

  it('calls onClose and onAddSubscription on final step action', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('or add custom'));
    await user.click(screen.getByText('Add my first subscription'));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onAddSubscription).toHaveBeenCalledOnce();
  });

  it('calls onClose on skip', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );

    await user.click(screen.getByText('Skip'));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onAddSubscription).not.toHaveBeenCalled();
  });

  it('renders 4 step indicators', () => {
    const { container } = renderWithProviders(
      <OnboardingModal onClose={onClose} onAddSubscription={onAddSubscription} />
    );
    // Step dots: one active (wider) + three inactive
    const stepDots = container.querySelectorAll('div[style*="border-radius: 4px"]');
    expect(stepDots.length).toBe(4);
  });
});
