export type ParagraphType = 'narration' | 'dialogue' | 'title';

export interface Paragraph {
  id: string;
  index: number;
  type: ParagraphType;
  raw: string;
  content: string;
  speaker: string | null;
  speakerConfidence: 'auto' | 'manual' | 'unknown';
}

export interface Novel {
  id: string;
  title: string;
  rawText: string;
  paragraphs: Paragraph[];
  characters: Character[];
  wordCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Character {
  name: string;
  dialogueCount: number;
  color: string;
}

export interface ReadingSettings {
  theme: 'light' | 'dark';
  fontFamily: 'songti' | 'wenkai' | 'mono';
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
}

export const CHARACTER_COLORS = [
  '#4a90d9', '#e67e22', '#27ae60', '#8e44ad',
  '#e74c3c', '#16a085', '#d35400', '#2980b9',
  '#c0392b', '#1abc9c',
];

export const DEFAULT_SETTINGS: ReadingSettings = {
  theme: 'light',
  fontFamily: 'wenkai',
  fontSize: 18,
  lineHeight: 1.8,
  paragraphSpacing: 16,
};

export const FONT_CLASS_MAP: Record<ReadingSettings['fontFamily'], string> = {
  songti: 'font-songti',
  wenkai: 'font-wenkai',
  mono: 'font-mono',
};
