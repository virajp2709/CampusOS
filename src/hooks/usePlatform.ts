export function usePlatform() {
  const isCapacitor = typeof (window as any)?.Capacitor !== 'undefined';
  const isAndroid = isCapacitor && (window as any)?.Capacitor?.getPlatform() === 'android';
  const isWeb = !isCapacitor || (window as any)?.Capacitor?.getPlatform() === 'web';

  return { isCapacitor, isAndroid, isWeb };
}
