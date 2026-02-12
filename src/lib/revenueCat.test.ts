// Tests for RevenueCat initialization module

import { isAndroid } from './platform';
import { initRevenueCat, identifyUser, resetUser } from './revenueCat';

// Mock the platform module
vi.mock('./platform', () => ({
  isAndroid: vi.fn(() => false),
}));

// Mock the logger
vi.mock('./logger', () => ({
  logger: {
    withContext: () => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  },
}));

// Mock RevenueCat SDK
const mockConfigure = vi.fn();
const mockLogIn = vi.fn();
const mockLogOut = vi.fn();

vi.mock('@revenuecat/purchases-capacitor', () => ({
  Purchases: {
    configure: mockConfigure,
    logIn: mockLogIn,
    logOut: mockLogOut,
  },
}));

describe('revenueCat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initRevenueCat', () => {
    it('does nothing on web (non-Android)', async () => {
      vi.mocked(isAndroid).mockReturnValue(false);

      await initRevenueCat();

      expect(mockConfigure).not.toHaveBeenCalled();
    });
  });

  describe('identifyUser', () => {
    it('does nothing on web', async () => {
      vi.mocked(isAndroid).mockReturnValue(false);

      await identifyUser('user-123');

      expect(mockLogIn).not.toHaveBeenCalled();
    });
  });

  describe('resetUser', () => {
    it('does nothing on web', async () => {
      vi.mocked(isAndroid).mockReturnValue(false);

      await resetUser();

      expect(mockLogOut).not.toHaveBeenCalled();
    });
  });
});
