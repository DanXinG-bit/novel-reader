import { useState, useRef, useEffect } from 'react';

interface Props {
  speaker: string | null;
  confidence: 'auto' | 'manual' | 'unknown';
  onEdit: (newSpeaker: string) => void;
}

export function SpeakerTag({ speaker, confidence, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(speaker ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) onEdit(trimmed);
    setEditing(false);
  };

  const displayName = speaker || '???';

  return (
    <div className={`speaker-tag ${confidence === 'manual' ? 'manual' : ''}`}>
      {editing ? (
        <input
          ref={inputRef}
          className="border rounded px-1 py-0.5 text-xs w-20"
          style={{
            borderColor: 'var(--dialogue-border)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
        />
      ) : (
        <>
          <span className="font-medium">{displayName}</span>
          <button
            className="ml-1 opacity-40 hover:opacity-100 transition-opacity text-xs"
            onClick={(e) => { e.stopPropagation(); setEditing(true); setValue(speaker ?? ''); }}
            aria-label="编辑说话者"
          >
            ✏️
          </button>
        </>
      )}
    </div>
  );
}
