export function isNativePlatform(): boolean {
  const w = window as any;
  if (w.Capacitor && typeof w.Capacitor.isNativePlatform === "function") {
    return w.Capacitor.isNativePlatform();
  }
  if (w.Capacitor && w.Capacitor.platform && w.Capacitor.platform !== "web") {
    return true;
  }
  return false;
}

export function isWebPlatform(): boolean {
  return !isNativePlatform();
}
