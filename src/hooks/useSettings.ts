import { useState, useEffect, useCallback } from 'react';
import type { ReadingSettings } from '../core/types';
import { DEFAULT_SETTINGS } from '../core/types';
import * as settingsStore from '../store/settingsStore';

export function useSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    settingsStore.getSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const update = useCallback(async (partial: Partial<ReadingSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    await settingsStore.saveSettings(next);
  }, [settings]);

  return { settings, update, loaded };
}
