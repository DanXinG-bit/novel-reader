import { describe, test, expect } from 'vitest';
import type { Novel } from '../../src/core/types';
import { nanoid } from 'nanoid';
import { saveNovel, getAllNovels, getNovel, deleteNovel, updateParagraphSpeaker, updateCharacters } from '../../src/store/novelStore';

function makeNovel(overrides: Partial<Novel> = {}): Novel {
  return {
    id: nanoid(),
    title: '测试小说',
    rawText: '测试内容。\n"你好。"小明说。',
    paragraphs: [
      { id: nanoid(), index: 0, type: 'narration', raw: '测试内容。', content: '测试内容。', speaker: null, speakerConfidence: 'auto' },
      { id: nanoid(), index: 1, type: 'dialogue', raw: '"你好。"小明说。', content: '你好。', speaker: '小明', speakerConfidence: 'auto' },
    ],
    characters: [{ name: '小明', dialogueCount: 1, color: '#4a90d9' }],
    wordCount: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('novelStore', () => {
  test('saveNovel 后 getAllNovels 能取到', async () => {
    const novel = makeNovel();
    await saveNovel(novel);
    const list = await getAllNovels();
    expect(list.find(n => n.id === novel.id)).toBeDefined();
  });

  test('getNovel 能获取指定小说', async () => {
    const novel = makeNovel();
    await saveNovel(novel);
    const found = await getNovel(novel.id);
    expect(found?.title).toBe('测试小说');
  });

  test('deleteNovel 后列表中不存在', async () => {
    const novel = makeNovel();
    await saveNovel(novel);
    await deleteNovel(novel.id);
    const found = await getNovel(novel.id);
    expect(found).toBeUndefined();
  });

  test('updateParagraphSpeaker 正确更新单条 paragraph', async () => {
    const novel = makeNovel();
    const targetId = novel.paragraphs[1].id;
    await saveNovel(novel);

    await updateParagraphSpeaker(novel.id, targetId, '小红');
    const updated = await getNovel(novel.id);
    const p = updated!.paragraphs.find(p => p.id === targetId);
    expect(p?.speaker).toBe('小红');
    expect(p?.speakerConfidence).toBe('manual');
  });

  test('updateCharacters 正确替换角色列表', async () => {
    const novel = makeNovel();
    await saveNovel(novel);

    const newChars = [{ name: '小红', dialogueCount: 2, color: '#e67e22' }];
    await updateCharacters(novel.id, newChars);
    const updated = await getNovel(novel.id);
    expect(updated!.characters).toEqual(newChars);
  });

  test('getNovel 不存在的 id 返回 undefined', async () => {
    const found = await getNovel('non-existent-id');
    expect(found).toBeUndefined();
  });
});
