import type { Paragraph } from './types';

interface SpeakerResult {
  name: string | null;
  confidence: 'auto' | 'unknown';
  matchedRule: number;
}

const COLON_RE = /^(.{1,6})[:：]/;

const VERB_DICT = [
  '说', '道', '问', '答', '喊', '叫',
  '笑道', '低声道', '沉声说', '轻声道', '怒道', '苦笑道',
  '冷声道', '叹道', '问道', '答道', '喊道', '叫道',
  '轻叹道', '苦笑', '冷声说', '淡淡说', '缓缓说',
];

const VERB_RE_STR = VERB_DICT.join('|');
const VERB_STRIP_RE = new RegExp(`(${VERB_RE_STR})$`);
const SPEAKER_BEFORE_RE = new RegExp(`(.{1,6})(${VERB_RE_STR})[:：]?\\s*[""'「『]`);
const SPEAKER_AFTER_RE = new RegExp(`[""'」』][^""'」』]*[""'」』]\\s*(.{1,6})(${VERB_RE_STR})`);

function stripTrailingVerb(name: string): string {
  return name.replace(VERB_STRIP_RE, '');
}

function extractName(match: RegExpMatchArray): string | null {
  let name = match[1].replace(/[:：\s]+$/, '');
  name = stripTrailingVerb(name);
  if (!name || name.length > 6) return null;
  return name;
}

export function detectSpeaker(
  currentLine: string,
  allLines: string[],
  currentIndex: number,
): SpeakerResult {
  // Rule 1: Colon prefix (highest priority)
  const colonMatch = currentLine.match(COLON_RE);
  if (colonMatch) {
    return { name: extractName(colonMatch), confidence: 'auto', matchedRule: 1 };
  }

  // Rule 2: Speaker tag before dialogue (in current line)
  const beforeMatch = currentLine.match(SPEAKER_BEFORE_RE);
  if (beforeMatch) {
    return { name: extractName(beforeMatch), confidence: 'auto', matchedRule: 2 };
  }

  // Rule 2 extended: Speaker tag in previous line
  if (currentIndex > 0) {
    const prevLine = allLines[currentIndex - 1];
    const prevColon = prevLine.match(COLON_RE);
    if (prevColon) {
      return { name: extractName(prevColon), confidence: 'auto', matchedRule: 2 };
    }
  }

  // Rule 3: Speaker tag after dialogue (in current line)
  const afterMatch = currentLine.match(SPEAKER_AFTER_RE);
  if (afterMatch) {
    return { name: extractName(afterMatch), confidence: 'auto', matchedRule: 3 };
  }

  // Rule 3 extended: Speaker tag in next line
  if (currentIndex < allLines.length - 1) {
    const nextLine = allLines[currentIndex + 1];
    const nextAfter = nextLine.match(SPEAKER_AFTER_RE);
    if (nextAfter) {
      return { name: extractName(nextAfter), confidence: 'auto', matchedRule: 3 };
    }
  }

  return { name: null, confidence: 'unknown', matchedRule: 4 };
}

export function buildCharacters(paragraphs: Paragraph[]) {
  const speakerMap = new Map<string, number>();
  for (const p of paragraphs) {
    if (p.type === 'dialogue' && p.speaker) {
      speakerMap.set(p.speaker, (speakerMap.get(p.speaker) ?? 0) + 1);
    }
  }
  return speakerMap;
}
