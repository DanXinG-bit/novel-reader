import { useMemo } from 'react';
import type { Novel } from '../../core/types';

interface Props {
  novel: Novel;
}

export function TextStats({ novel }: Props) {
  const stats = useMemo(() => {
    const total = novel.paragraphs.length;
    const dialogue = novel.paragraphs.filter(p => p.type === 'dialogue').length;
    const narration = novel.paragraphs.filter(p => p.type === 'narration').length;
    const title = novel.paragraphs.filter(p => p.type === 'title').length;
    const dialogueWords = novel.paragraphs
      .filter(p => p.type === 'dialogue')
      .reduce((sum, p) => sum + p.content.length, 0);
    const dialoguePct = novel.wordCount > 0 ? Math.round((dialogueWords / novel.wordCount) * 100) : 0;
    const narrationPct = 100 - dialoguePct;
    return { total, dialogue, narration, title, dialoguePct, narrationPct };
  }, [novel]);

  const cx = 50, cy = 50, r = 40;
  const circumference = 2 * Math.PI * r;
  const dialogueDash = (stats.dialoguePct / 100) * circumference;
  const narrationDash = circumference - dialogueDash;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke="var(--accent)" strokeWidth="8"
            strokeDasharray={`${dialogueDash} ${narrationDash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="12" fill="var(--text-primary)" fontWeight="bold">
            {stats.dialoguePct}%
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="var(--text-secondary)">
            对话占比
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-2xl font-bold">{novel.wordCount.toLocaleString()}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>总字数</div>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>段落数</div>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{stats.dialogue}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>对话段落</div>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="text-2xl font-bold">{stats.narration}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>旁白段落</div>
        </div>
      </div>
    </div>
  );
}
