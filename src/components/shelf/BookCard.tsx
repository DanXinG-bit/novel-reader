import type { Novel } from '../../core/types';

interface Props {
  novel: Novel;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ novel, onOpen, onDelete }: Props) {
  const created = new Date(novel.createdAt).toLocaleDateString('zh-CN');

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer
                 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
      onClick={() => onOpen(novel.id)}
      onContextMenu={(e) => { e.preventDefault(); onDelete(novel.id); }}
    >
      <h3 className="font-bold text-lg truncate">{novel.title}</h3>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        {novel.wordCount.toLocaleString()} 字
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
        {created}
      </p>
      <button
        className="absolute top-2 right-2 p-1 rounded-full opacity-0 hover:opacity-100
                   transition-opacity text-gray-400 hover:text-red-500"
        onClick={(e) => { e.stopPropagation(); onDelete(novel.id); }}
        aria-label="删除"
      >
        ✕
      </button>
    </div>
  );
}
