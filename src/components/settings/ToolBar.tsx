import { useState } from 'react';
import type { ReadingSettings } from '../../core/types';
import { ThemeToggle } from './ThemeToggle';
import { FontPicker } from './FontPicker';
import { SliderControl } from './SliderControl';

interface Props {
  settings: ReadingSettings;
  onUpdate: (partial: Partial<ReadingSettings>) => void;
  onOpenPanel: () => void;
}

export function ToolBar({ settings, onUpdate, onOpenPanel }: Props) {
  const [showFont, setShowFont] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);

  return (
    <>
      {/* Spacing panel */}
      {showSpacing && (
        <div
          className="fixed bottom-16 left-0 right-0 mx-4 p-4 rounded-xl shadow-lg z-20 max-w-sm"
          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-secondary)' }}
        >
          <SliderControl
            label="行距"
            value={settings.lineHeight}
            min={1.4} max={2.4} step={0.1}
            onChange={(v) => onUpdate({ lineHeight: v })}
          />
          <SliderControl
            label="段间距"
            value={settings.paragraphSpacing}
            min={8} max={32} step={2}
            onChange={(v) => onUpdate({ paragraphSpacing: v })}
            suffix="px"
          />
        </div>
      )}

      {/* Font panel */}
      {showFont && (
        <FontPicker settings={settings} onUpdate={onUpdate} />
      )}

      {/* Toolbar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-4 px-4 py-3
                   border-t shadow-lg"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--bg-secondary)',
        }}
      >
        <ThemeToggle theme={settings.theme} onToggle={(t) => onUpdate({ theme: t })} />

        <button
          className={`p-2 rounded-full transition-colors font-bold text-sm ${showFont ? 'ring-2' : ''}`}
          style={{
            backgroundColor: showFont ? 'var(--accent)' : 'var(--bg-secondary)',
            color: showFont ? '#fff' : 'var(--text-primary)',
          }}
          onClick={() => { setShowFont(!showFont); setShowSpacing(false); }}
        >
          Aa
        </button>

        <button
          className={`p-2 rounded-full transition-colors text-sm ${showSpacing ? 'ring-2' : ''}`}
          style={{
            backgroundColor: showSpacing ? 'var(--accent)' : 'var(--bg-secondary)',
            color: showSpacing ? '#fff' : 'var(--text-primary)',
          }}
          onClick={() => { setShowSpacing(!showSpacing); setShowFont(false); }}
        >
          ↔
        </button>

        <button
          className="p-2 rounded-full transition-colors text-lg"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
          onClick={onOpenPanel}
          aria-label="信息面板"
        >
          ≡
        </button>
      </div>
    </>
  );
}
