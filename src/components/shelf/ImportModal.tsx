import { useState } from 'react';
import type { Novel, Character } from '../../core/types';
import { nanoid } from 'nanoid';
import { parseText } from '../../core/parser';
import { buildCharacters } from '../../core/speakerDetector';
import { CHARACTER_COLORS } from '../../core/types';
import { saveNovel } from '../../store/novelStore';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export function ImportModal({ onClose, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !text.trim()) return;
    setSaving(true);

    const paragraphs = parseText(text);
    console.log('[ImportModal] parsed paragraphs:', paragraphs.length);
    console.log('[ImportModal] dialogue count:', paragraphs.filter(p => p.type === 'dialogue').length);
    console.log('[ImportModal] narration count:', paragraphs.filter(p => p.type === 'narration').length);
    console.log('[ImportModal] first 3:', paragraphs.slice(0, 3).map(p => ({ type: p.type, content: p.content.substring(0, 30) })));

    // Debug: show char codes of first 100 chars
    const sample = text.substring(0, 100);
    const codes = [...sample].filter(c => c.charCodeAt(0) > 127).map(c => c + '=U+' + c.charCodeAt(0).toString(16));
    console.log('[ImportModal] unicode chars:', codes.slice(0, 20));

    const speakerMap = buildCharacters(paragraphs);
    const characters: Character[] = Array.from(speakerMap.entries()).map(
      ([name, count], i) => ({
        name,
        dialogueCount: count,
        color: CHARACTER_COLORS[i % CHARACTER_COLORS.length],
      }),
    );

    const wordCount = text.replace(/\s/g, '').length;

    const novel: Novel = {
      id: nanoid(),
      title: title.trim(),
      rawText: text,
      paragraphs,
      characters,
      wordCount,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveNovel(novel);
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <h2 className="text-xl font-bold mb-4">导入小说</h2>

        <label className="block text-sm font-medium mb-1">书名</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--dialogue-border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入书名..."
        />

        <label className="block text-sm font-medium mb-1">文本内容</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm resize-y focus:outline-none focus:ring-2"
          rows={12}
          style={{
            borderColor: 'var(--dialogue-border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="粘贴小说文本..."
        />

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
            onClick={handleSave}
            disabled={saving || !title.trim() || !text.trim()}
          >
            {saving ? '解析中...' : '解析并保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
