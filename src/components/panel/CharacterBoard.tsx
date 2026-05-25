import type { Novel } from '../../core/types';

interface Props {
  novel: Novel;
  highlightCharacter: string | null;
  onHighlight: (name: string | null) => void;
}

export function CharacterBoard({ novel, highlightCharacter, onHighlight }: Props) {
  if (novel.characters.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        暂无识别到的角色
      </p>
    );
  }

  const maxCount = Math.max(...novel.characters.map(c => c.dialogueCount), 1);

  return (
    <div className="space-y-2">
      {novel.characters.map(c => {
        const active = highlightCharacter === c.name;
        const pct = Math.round((c.dialogueCount / maxCount) * 100);
        return (
          <button
            key={c.name}
            className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-3
              ${active ? 'ring-2' : ''}`}
            style={{
              backgroundColor: active ? `${c.color}20` : 'var(--bg-secondary)',
            }}
            onClick={() => onHighlight(active ? null : c.name)}
          >
            <span
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: c.color }}
            >
              {c.name.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium block truncate">{c.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: c.color }}
                  />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {c.dialogueCount}句
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
