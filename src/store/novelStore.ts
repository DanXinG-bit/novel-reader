import type { Novel, Character } from '../core/types';
import { initDB } from './db';

export async function getAllNovels(): Promise<Novel[]> {
  try {
    const db = await initDB();
    return await db.getAll('novels');
  } catch {
    return [];
  }
}

export async function getNovel(id: string): Promise<Novel | undefined> {
  try {
    const db = await initDB();
    return await db.get('novels', id);
  } catch {
    return undefined;
  }
}

export async function saveNovel(novel: Novel): Promise<void> {
  try {
    const db = await initDB();
    await db.put('novels', novel);
  } catch (e) {
    console.error('Failed to save novel:', e);
  }
}

export async function deleteNovel(id: string): Promise<void> {
  try {
    const db = await initDB();
    await db.delete('novels', id);
  } catch (e) {
    console.error('Failed to delete novel:', e);
  }
}

export async function updateCharacters(
  novelId: string,
  characters: Character[],
): Promise<void> {
  try {
    const db = await initDB();
    const novel = await db.get('novels', novelId);
    if (novel) {
      novel.characters = characters;
      novel.updatedAt = Date.now();
      await db.put('novels', novel);
    }
  } catch (e) {
    console.error('Failed to update characters:', e);
  }
}

export async function updateParagraphSpeaker(
  novelId: string,
  paragraphId: string,
  speaker: string,
): Promise<void> {
  try {
    const db = await initDB();
    const novel = await db.get('novels', novelId) as Novel | undefined;
    if (novel) {
      const p = novel.paragraphs.find(p => p.id === paragraphId);
      if (p) {
        p.speaker = speaker;
        p.speakerConfidence = 'manual';
      }
      novel.updatedAt = Date.now();
      await db.put('novels', novel);
    }
  } catch (e) {
    console.error('Failed to update speaker:', e);
  }
}
