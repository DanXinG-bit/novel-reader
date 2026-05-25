import { useState, useCallback } from 'react';
import { BookShelf } from './components/shelf/BookShelf';
import { ReaderView } from './components/reader/ReaderView';

type Page = { type: 'shelf' } | { type: 'reader'; novelId: string };

export default function App() {
  const [page, setPage] = useState<Page>({ type: 'shelf' });

  const handleOpenNovel = useCallback((id: string) => {
    setPage({ type: 'reader', novelId: id });
  }, []);

  const handleBack = useCallback(() => {
    setPage({ type: 'shelf' });
  }, []);

  return (
    <>
      {page.type === 'shelf' ? (
        <BookShelf onOpenNovel={handleOpenNovel} />
      ) : (
        <ReaderView novelId={page.novelId} onBack={handleBack} />
      )}
    </>
  );
}
