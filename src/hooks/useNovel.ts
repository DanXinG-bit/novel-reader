import { useState, useEffect, useCallback } from 'react';
import type { Novel, Character } from '../core/types';
import * as novelStore from '../store/novelStore';

export function useNovelList() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await novelStore.getAllNovels();
    setNovels(list.sort((a, b) => b.updatedAt - a.updatedAt));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await novelStore.deleteNovel(id);
    setNovels(prev => prev.filter(n => n.id !== id));
  }, []);

  return { novels, loading, refresh, remove };
}

export function useNovel(id: string | null) {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) { setNovel(null); setLoading(false); return; }
    setLoading(true);
    const n = await novelStore.getNovel(id);
    setNovel(n ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateSpeaker = useCallback(async (paragraphId: string, speaker: string) => {
    if (!id || !novel) return;
    await novelStore.updateParagraphSpeaker(id, paragraphId, speaker);
    setNovel(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        paragraphs: prev.paragraphs.map(p =>
          p.id === paragraphId
            ? { ...p, speaker, speakerConfidence: 'manual' as const }
            : p,
        ),
        updatedAt: Date.now(),
      };
    });
  }, [id, novel]);

  const refreshCharacters = useCallback(async (characters: Character[]) => {
    if (!id || !novel) return;
    await novelStore.updateCharacters(id, characters);
    setNovel(prev => prev ? { ...prev, characters, updatedAt: Date.now() } : prev);
  }, [id, novel]);

  return { novel, loading, refresh, updateSpeaker, refreshCharacters };
}
