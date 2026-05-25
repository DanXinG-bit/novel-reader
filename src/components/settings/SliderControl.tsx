interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}

export function SliderControl({ label, value, min, max, step, onChange, suffix }: Props) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs w-14 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'var(--accent)' }}
      />
      <span className="text-xs w-10 text-right" style={{ color: 'var(--text-secondary)' }}>
        {value}{suffix ?? ''}
      </span>
    </div>
  );
}
