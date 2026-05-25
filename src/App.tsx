import { useState, useEffect, useCallback } from 'react';
import { BookShelf } from './components/shelf/BookShelf';
import { ReaderView } from './components/reader/ReaderView';
import { useSettings } from './hooks/useSettings';

type Page = { type: 'shelf' } | { type: 'reader'; novelId: string };

export default function App() {
  const [page, setPage] = useState<Page>({ type: 'shelf' });
  const { settings, loaded } = useSettings();

  useEffect(() => {
    if (loaded) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme, loaded]);

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
