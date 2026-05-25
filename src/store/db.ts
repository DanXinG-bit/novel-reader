import { openDB } from 'idb';

export const initDB = () =>
  openDB('novel-reader-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('novels')) {
        db.createObjectStore('novels', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
