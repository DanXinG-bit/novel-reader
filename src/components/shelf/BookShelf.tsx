import { useState } from 'react';
import { useNovelList } from '../../hooks/useNovel';
import { BookCard } from './BookCard';
import { ImportModal } from './ImportModal';

interface Props {
  onOpenNovel: (id: string) => void;
}

export function BookShelf({ onOpenNovel }: Props) {
  const { novels, loading, refresh, remove } = useNovelList();
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="min-h-screen p-4 pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-bold text-center py-6">📚 我的书架</h1>

      {loading ? (
        <p className="text-center mt-12" style={{ color: 'var(--text-secondary)' }}>加载中...</p>
      ) : novels.length === 0 ? (
        <div className="text-center mt-12" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-4xl mb-4">📖</p>
          <p>书架空空，点击右下角按钮导入小说</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {novels.map(n => (
            <BookCard key={n.id} novel={n} onOpen={onOpenNovel} onDelete={remove} />
          ))}
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center
                   justify-center text-white text-2xl hover:shadow-xl transition-shadow z-40"
        style={{ backgroundColor: 'var(--accent)' }}
        onClick={() => setShowImport(true)}
        aria-label="导入小说"
      >
        +
      </button>

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onSaved={refresh} />
      )}
    </div>
  );
}
