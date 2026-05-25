import type { ReadingSettings } from '../core/types';
import { DEFAULT_SETTINGS } from '../core/types';
import { initDB } from './db';

export async function getSettings(): Promise<ReadingSettings> {
  try {
    const db = await initDB();
    const record = await db.get('settings', 'readingSettings');
    return record?.value ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: ReadingSettings): Promise<void> {
  try {
    const db = await initDB();
    await db.put('settings', { key: 'readingSettings', value: settings });
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
