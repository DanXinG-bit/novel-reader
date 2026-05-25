import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.novelreader.app',
  appName: '小说阅读器',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: '',
      keystoreAlias: '',
    },
  },
};

export default config;
