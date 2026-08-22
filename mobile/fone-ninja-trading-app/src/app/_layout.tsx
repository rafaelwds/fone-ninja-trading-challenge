import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppThemeProvider } from '@/theme/provider';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AnimatedSplashOverlay />
      <AppTabs />
    </AppThemeProvider>
  );
}
