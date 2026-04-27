import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pawprint.registry',
  appName: 'PawPrint Registry',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0A0F1E',
    captureInput: true,
    webContentsDebuggingEnabled: false,   // set true only for dev
  },
  plugins: {
    Camera: {
      permissions: ['camera'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0F1E',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0A0F1E',
    },
  },
};

export default config;
