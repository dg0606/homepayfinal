import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homepay.app',
  appName: 'HomePay',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  backgroundColor: '#2196F3',
  android: {
    backgroundColor: '#2196F3',
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      scheduleMode: 'exact',
      smallIcon: 'ic_stat_notify',
      iconColor: '#2196F3',
    },
  },
};

export default config;