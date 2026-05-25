import type { Novel } from '../../core/types';
import { CharacterBoard } from './CharacterBoard';
import { TextStats } from './TextStats';

interface Props {
  open: boolean;
  activeTab: 'characters' | 'stats';
  onTabChange: (tab: 'characters' | 'stats') => void;
  onClose: () => void;
  novel: Novel;
  highlightCharacter: string | null;
  onHighlightCharacter: (name: string | null) => void;
}

export function InfoPanel({
  open, activeTab, onTabChange, onClose,
  novel, highlightCharacter, onHighlightCharacter,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] shadow-xl overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--bg-secondary)' }}>
          <h3 className="font-bold">信息面板</h3>
          <button onClick={onClose} className="text-lg" aria-label="关闭">✕</button>
        </div>

        <div className="flex border-b" style={{ borderColor: 'var(--bg-secondary)' }}>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors
              ${activeTab === 'characters' ? 'border-b-2' : ''}`}
            style={{
              borderColor: activeTab === 'characters' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'characters' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onClick={() => onTabChange('characters')}
          >
            角色
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors
              ${activeTab === 'stats' ? 'border-b-2' : ''}`}
            style={{
              borderColor: activeTab === 'stats' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'stats' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onClick={() => onTabChange('stats')}
          >
            统计
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'characters' ? (
            <CharacterBoard
              novel={novel}
              highlightCharacter={highlightCharacter}
              onHighlight={onHighlightCharacter}
            />
          ) : (
            <TextStats novel={novel} />
          )}
        </div>
      </div>
    </>
  );
}
