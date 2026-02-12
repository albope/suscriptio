// Tests for platform detection utilities

import { isNative, isAndroid, isWeb } from './platform';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

describe('platform detection', () => {
  afterEach(() => {
    delete win.Capacitor;
  });

  describe('when Capacitor is not available (web)', () => {
    it('isNative returns false', () => {
      expect(isNative()).toBe(false);
    });

    it('isAndroid returns false', () => {
      expect(isAndroid()).toBe(false);
    });

    it('isWeb returns true', () => {
      expect(isWeb()).toBe(true);
    });
  });

  describe('when running on Android native', () => {
    beforeEach(() => {
      win.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => 'android',
      };
    });

    it('isNative returns true', () => {
      expect(isNative()).toBe(true);
    });

    it('isAndroid returns true', () => {
      expect(isAndroid()).toBe(true);
    });

    it('isWeb returns false', () => {
      expect(isWeb()).toBe(false);
    });
  });

  describe('when running on iOS native', () => {
    beforeEach(() => {
      win.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => 'ios',
      };
    });

    it('isNative returns true', () => {
      expect(isNative()).toBe(true);
    });

    it('isAndroid returns false', () => {
      expect(isAndroid()).toBe(false);
    });

    it('isWeb returns false', () => {
      expect(isWeb()).toBe(false);
    });
  });
});
