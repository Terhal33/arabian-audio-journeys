
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.53c1a4bc17cb45fcbde7ef4eee2a59b1',
  appName: 'terhal',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F5F2E8',
      showSpinner: false
    }
  }
};

export default config;
