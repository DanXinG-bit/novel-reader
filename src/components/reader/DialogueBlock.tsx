import type { Paragraph } from '../../core/types';
import { SpeakerTag } from './SpeakerTag';

interface Props {
  paragraph: Paragraph;
  onEditSpeaker: (paragraphId: string, speaker: string) => void;
  highlighted?: boolean;
  characterColor?: string;
}

export function DialogueBlock({ paragraph, onEditSpeaker, highlighted, characterColor }: Props) {
  return (
    <div
      className={`dialogue-block ${highlighted ? 'character-highlight' : ''}`}
      style={characterColor ? { borderLeftColor: characterColor } : undefined}
    >
      <SpeakerTag
        speaker={paragraph.speaker}
        confidence={paragraph.speakerConfidence}
        onEdit={(s) => onEditSpeaker(paragraph.id, s)}
      />
      <p>{paragraph.content}</p>
    </div>
  );
}
