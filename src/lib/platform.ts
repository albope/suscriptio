// Platform detection utilities
// Uses the global Capacitor object injected by @capacitor/core at runtime
// Works safely before and after Capacitor is installed

interface CapacitorGlobal {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
}

const getCapacitor = (): CapacitorGlobal | undefined =>
  (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;

export const isNative = (): boolean => getCapacitor()?.isNativePlatform() ?? false;
export const isAndroid = (): boolean => getCapacitor()?.getPlatform() === 'android';
export const isWeb = (): boolean => !isNative();
