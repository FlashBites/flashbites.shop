import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flashbites.app',
  appName: 'Flashbites',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'localhost'
  }
};

export default config;