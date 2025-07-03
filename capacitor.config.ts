
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.53c1a4bc17cb45fcbde7ef4eee2a59b1',
  appName: 'terhal',
  webDir: 'dist',
  server: {
    url: 'https://53c1a4bc-17cb-45fc-bde7-ef4eee2a59b1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F5F2E8',
      showSpinner: false
    }
  }
};

export default config;
