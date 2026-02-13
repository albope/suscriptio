import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.suscriptio.app',
  appName: 'Suscriptio',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      iconColor: '#00d4ff',
    },
  },
};

export default config;
