import type { ReadingSettings } from '../../core/types';
import { SliderControl } from './SliderControl';

interface Props {
  settings: ReadingSettings;
  onUpdate: (partial: Partial<ReadingSettings>) => void;
}

const FONTS: { key: ReadingSettings['fontFamily']; label: string; className: string }[] = [
  { key: 'wenkai', label: '霞鹜文楷', className: 'font-wenkai' },
  { key: 'songti', label: '思源宋体', className: 'font-songti' },
  { key: 'mono', label: '等线体', className: 'font-mono' },
];

export function FontPicker({ settings, onUpdate }: Props) {
  return (
    <div
      className="fixed bottom-16 left-0 right-0 mx-4 p-4 rounded-xl shadow-lg z-20 max-w-sm"
      style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--bg-secondary)' }}
    >
      <div className="flex gap-2 mb-3">
        {FONTS.map(f => (
          <button
            key={f.key}
            className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors ${f.className}`}
            style={{
              backgroundColor: settings.fontFamily === f.key ? 'var(--accent)' : 'var(--bg-secondary)',
              color: settings.fontFamily === f.key ? '#fff' : 'var(--text-primary)',
            }}
            onClick={() => onUpdate({ fontFamily: f.key })}
          >
            {f.label}
          </button>
        ))}
      </div>
      <SliderControl
        label="字号"
        value={settings.fontSize}
        min={14} max={24} step={1}
        onChange={(v) => onUpdate({ fontSize: v })}
        suffix="px"
      />
    </div>
  );
}
