import { openDB } from 'idb';

export const dbPromise = openDB('quizzes-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('quizzes')) {
      db.createObjectStore('quizzes', { keyPath: 'id' });
    }
  },
});
