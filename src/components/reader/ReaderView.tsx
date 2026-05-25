import { useState, useCallback } from 'react';
import { useNovel } from '../../hooks/useNovel';
import { useSettings } from '../../hooks/useSettings';
import { ParagraphList } from './ParagraphList';
import { ToolBar } from '../settings/ToolBar';
import { InfoPanel } from '../panel/InfoPanel';
import { usePanel } from '../../hooks/usePanel';
import { FONT_CLASS_MAP } from '../../core/types';
import '../../styles/themes.css';

interface Props {
  novelId: string;
  onBack: () => void;
}

export function ReaderView({ novelId, onBack }: Props) {
  const { novel, loading, updateSpeaker, refreshCharacters } = useNovel(novelId);
  const { settings, update, loaded } = useSettings();
  const { panelOpen, activeTab, setActiveTab, openPanel, closePanel } = usePanel();
  const [highlightCharacter, setHighlightCharacter] = useState<string | null>(null);

  const handleEditSpeaker = useCallback(
    (paragraphId: string, speaker: string) => {
      updateSpeaker(paragraphId, speaker);
      if (novel) {
        const existing = novel.characters.find(c => c.name === speaker);
        if (existing) {
          refreshCharacters(
            novel.characters.map(c =>
              c.name === speaker ? { ...c, dialogueCount: c.dialogueCount + 1 } : c,
            ),
          );
        }
      }
    },
    [updateSpeaker, novel, refreshCharacters],
  );

  if (!loaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>加载中...</p>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>小说不存在</p>
        <button onClick={onBack} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--accent)' }}>返回书架</button>
      </div>
    );
  }

  const fontClass = FONT_CLASS_MAP[settings.fontFamily];

  return (
    <div
      className={`reader-container min-h-screen pb-24 ${fontClass}`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        '--fs': `${settings.fontSize}px`,
        '--lh': `${settings.lineHeight}`,
        '--ps': `${settings.paragraphSpacing}px`,
      } as React.CSSProperties}
    >
      <header
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 shadow-sm"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <button onClick={onBack} className="text-lg" aria-label="返回">←</button>
        <h1 className="text-lg font-bold truncate">{novel.title}</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <ParagraphList
          paragraphs={novel.paragraphs}
          onEditSpeaker={handleEditSpeaker}
          highlightCharacter={highlightCharacter}
          characters={novel.characters}
        />
      </main>

      <ToolBar
        settings={settings}
        onUpdate={update}
        onOpenPanel={() => openPanel()}
      />

      <InfoPanel
        open={panelOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={closePanel}
        novel={novel}
        highlightCharacter={highlightCharacter}
        onHighlightCharacter={setHighlightCharacter}
      />
    </div>
  );
}
