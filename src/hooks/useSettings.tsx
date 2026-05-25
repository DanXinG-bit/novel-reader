import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ReadingSettings } from '../core/types';
import { DEFAULT_SETTINGS } from '../core/types';
import * as settingsStore from '../store/settingsStore';

interface SettingsCtx {
  settings: ReadingSettings;
  update: (partial: Partial<ReadingSettings>) => Promise<void>;
  loaded: boolean;
}

const SettingsContext = createContext<SettingsCtx>({
  settings: DEFAULT_SETTINGS,
  update: async () => {},
  loaded: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    settingsStore.getSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme, loaded]);

  const update = useCallback(async (partial: Partial<ReadingSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    await settingsStore.saveSettings(next);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, update, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
