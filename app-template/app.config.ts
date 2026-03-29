import { ExpoConfig, ConfigContext } from 'expo/config';
import { appConfig } from './config/tenant';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  
  // ==========================================================================
  // BASIC INFO (from tenant config)
  // ==========================================================================
  name: appConfig.appName,
  slug: appConfig.id,
  version: appConfig.version,
  
  // ==========================================================================
  // BUILD CONFIG
  // ==========================================================================
  orientation: 'portrait',
  scheme: appConfig.id,
  
  // Icons & Splash
  icon: appConfig.branding.logo,
  splash: {
    image: appConfig.branding.splashIcon,
    resizeMode: 'contain',
    backgroundColor: appConfig.colors.light.primary,
  },
  
  // ==========================================================================
  // PLATFORM SPECIFIC
  // ==========================================================================
  ios: {
    supportsTablet: true,
    bundleIdentifier: appConfig.bundleId,
    buildNumber: '1',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 
        'Standortdaten werden für GPS-Tracking und Auftragsnavigation benötigt.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Standortdaten werden für Hintergrund-GPS-Tracking benötigt.',
      NSCameraUsageDescription:
        'Die Kamera wird für Protokollfotos und QR-Scans benötigt.',
      NSPhotoLibraryUsageDescription:
        'Zugriff auf Fotos für Protokolldokumentation.',
    },
  },
  
  android: {
    package: appConfig.bundleId,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: appConfig.branding.adaptiveIconFg,
      backgroundColor: appConfig.branding.adaptiveIconBg,
    },
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
    ],
  },
  
  // ==========================================================================
  // PLUGINS
  // ==========================================================================
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Standortdaten werden für GPS-Tracking benötigt.',
        isAndroidBackgroundLocationEnabled: appConfig.features.gpsTracking,
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Die Kamera wird für Fotos und QR-Scans benötigt.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: appConfig.colors.light.primary,
      },
    ],
    [
      '@nozbe/watermelondb',
      {
        databases: ['default'],
      },
    ],
  ],
  
  // ==========================================================================
  // EXTRA CONFIG
  // ==========================================================================
  extra: {
    tenantId: appConfig.id,
    apiBaseUrl: appConfig.api.baseUrl,
    wpBaseUrl: appConfig.api.wpBaseUrl,
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  
  // ==========================================================================
  // NEW ARCHITECTURE (required for reanimated v4+)
  // ==========================================================================
  newArchEnabled: true,
  
  // ==========================================================================
  // UPDATES
  // ==========================================================================
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
  },
  
  runtimeVersion: {
    policy: 'appVersion',
  },
});
