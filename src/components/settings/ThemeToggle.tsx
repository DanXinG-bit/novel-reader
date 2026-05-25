import type { ReadingSettings } from '../../core/types';

interface Props {
  theme: ReadingSettings['theme'];
  onToggle: (theme: ReadingSettings['theme']) => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      className="p-2 rounded-full transition-colors text-lg"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
      onClick={() => onToggle(next)}
      aria-label={`切换${next === 'dark' ? '暗色' : '亮色'}主题`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
