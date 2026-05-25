import type { Paragraph, ParagraphType } from './types';
import { nanoid } from 'nanoid';
import { detectSpeaker } from './speakerDetector';

const CHAPTER_RE = /^第[零一二三四五六七八九十百千万\d]+[章节回]/;

const QUOTE_PATTERNS: RegExp[] = [
  /[""][^""]+[""]/,
  /"[^"]+"/,
  /「[^」]+」/,
  /『[^』]+』/,
];

function hasQuote(line: string): boolean {
  for (const re of QUOTE_PATTERNS) {
    if (re.test(line)) return true;
  }
  return false;
}

function quotedRatio(line: string): number {
  let quotedChars = 0;
  for (const re of QUOTE_PATTERNS) {
    const matches = line.match(re);
    if (matches) {
      for (const m of matches) {
        quotedChars += m.length;
      }
    }
  }
  return quotedChars / Math.max(line.length, 1);
}

function stripQuotes(content: string): string {
  return content
    .replace(/^[""]/, '')
    .replace(/[""]$/, '')
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/^「/, '')
    .replace(/」$/, '')
    .replace(/^『/, '')
    .replace(/』$/, '');
}

function splitMixedLine(line: string): string[] {
  const parts: string[] = [];
  let remaining = line;
  for (const re of QUOTE_PATTERNS) {
    const match = remaining.match(re);
    if (match && match.index !== undefined) {
      const before = remaining.slice(0, match.index).trim();
      const quoted = match[0];
      const after = remaining.slice(match.index! + quoted.length).trim();
      if (before) parts.push(before);
      parts.push(quoted);
      if (after) {
        const subParts = splitMixedLine(after);
        parts.push(...subParts);
      }
      return parts;
    }
  }
  parts.push(remaining);
  return parts;
}

function classifyLine(line: string): ParagraphType {
  if (CHAPTER_RE.test(line.trim())) return 'title';
  if (hasQuote(line) && quotedRatio(line) > 0.5) return 'dialogue';
  return 'narration';
}

export function parseText(rawText: string): Paragraph[] {
  const rawLines = rawText.split(/\n/);
  const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);

  const paragraphs: Paragraph[] = [];
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const type = classifyLine(line);

    if (type === 'dialogue') {
      const parts = splitMixedLine(line);
      for (const part of parts) {
        const partType = classifyLine(part);
        const speaker = partType === 'dialogue'
          ? detectSpeaker(part, lines, i)
          : null;

        paragraphs.push({
          id: nanoid(),
          index: index++,
          type: partType,
          raw: part,
          content: partType === 'dialogue' ? stripQuotes(part) : part,
          speaker: speaker?.name ?? null,
          speakerConfidence: speaker?.confidence ?? (partType === 'dialogue' ? 'unknown' : 'auto'),
        });
      }
    } else {
      paragraphs.push({
        id: nanoid(),
        index: index++,
        type,
        raw: line,
        content: line,
        speaker: null,
        speakerConfidence: 'auto',
      });
    }
  }

  return paragraphs;
}
