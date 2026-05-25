import { useMemo } from 'react';
import type { Paragraph, Character } from '../../core/types';
import { NarrationBlock } from './NarrationBlock';
import { DialogueBlock } from './DialogueBlock';

interface Props {
  paragraphs: Paragraph[];
  onEditSpeaker: (paragraphId: string, speaker: string) => void;
  highlightCharacter: string | null;
  characters: Character[];
}

export function ParagraphList({ paragraphs, onEditSpeaker, highlightCharacter, characters }: Props) {
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of characters) map.set(c.name, c.color);
    return map;
  }, [characters]);

  return (
    <div>
      {paragraphs.map(p => {
        if (p.type === 'title') {
          return <h2 key={p.id} className="title-block">{p.content}</h2>;
        }
        if (p.type === 'dialogue') {
          const highlighted = highlightCharacter != null && p.speaker === highlightCharacter;
          return (
            <DialogueBlock
              key={p.id}
              paragraph={p}
              onEditSpeaker={onEditSpeaker}
              highlighted={highlighted}
              characterColor={p.speaker ? colorMap.get(p.speaker) : undefined}
            />
          );
        }
        return <NarrationBlock key={p.id} content={p.content} />;
      })}
    </div>
  );
}
