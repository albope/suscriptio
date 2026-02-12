import { renderWithProviders, screen } from '@/test/utils';
import { SubscriptionLimitBar } from './SubscriptionLimitBar';

// Mock useTierLimits hook
const mockUseTierLimits = vi.fn();
vi.mock('@/hooks/useTierLimits', () => ({
  useTierLimits: () => mockUseTierLimits(),
}));

describe('SubscriptionLimitBar', () => {
  const onUpgradeClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing for premium users', () => {
    mockUseTierLimits.mockReturnValue({
      tier: 'premium',
      currentCount: 10,
      remainingSlots: Infinity,
    });

    const { container } = renderWithProviders(
      <SubscriptionLimitBar onUpgradeClick={onUpgradeClick} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows subscription count for free tier', () => {
    mockUseTierLimits.mockReturnValue({
      tier: 'free',
      currentCount: 1,
      remainingSlots: 2,
    });

    renderWithProviders(<SubscriptionLimitBar onUpgradeClick={onUpgradeClick} />);
    expect(screen.getByText('1/3 subscriptions')).toBeInTheDocument();
  });

  it('shows warning when almost full (1 slot remaining)', () => {
    mockUseTierLimits.mockReturnValue({
      tier: 'free',
      currentCount: 2,
      remainingSlots: 1,
    });

    renderWithProviders(<SubscriptionLimitBar onUpgradeClick={onUpgradeClick} />);
    expect(screen.getByText('Last slot!')).toBeInTheDocument();
  });

  it('shows unlock button when at limit', () => {
    mockUseTierLimits.mockReturnValue({
      tier: 'free',
      currentCount: 3,
      remainingSlots: 0,
    });

    renderWithProviders(<SubscriptionLimitBar onUpgradeClick={onUpgradeClick} />);
    const button = screen.getByText('Unlock unlimited');
    expect(button).toBeInTheDocument();
    button.click();
    expect(onUpgradeClick).toHaveBeenCalledOnce();
  });

  it('shows price hint when not at limit', () => {
    mockUseTierLimits.mockReturnValue({
      tier: 'free',
      currentCount: 0,
      remainingSlots: 3,
    });

    renderWithProviders(<SubscriptionLimitBar onUpgradeClick={onUpgradeClick} />);
    expect(screen.getByText(/Unlimited for/)).toBeInTheDocument();
  });
});
