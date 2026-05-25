import type { Paragraph, ParagraphType } from './types';
import { nanoid } from 'nanoid';
import { detectSpeaker } from './speakerDetector';

const CHAPTER_RE = /^第[零一二三四五六七八九十百千万\d]+[章节回]/;

// Quote pairs: [open, close]
const QUOTE_PAIRS: [string, string][] = [
  ['“', '”'], // Chinese curly ""
  ['"', '"'], // ASCII straight ""
  ['「', '」'], // Japanese 「」
  ['『', '』'], // Japanese 『』
];

const OPEN_QUOTES = new Set(QUOTE_PAIRS.map(p => p[0]));
const QUOTE_CHARS = new Set(QUOTE_PAIRS.flat());

function hasQuote(line: string): boolean {
  for (const [open] of QUOTE_PAIRS) {
    if (line.includes(open)) return true;
  }
  return false;
}

function quotedRatio(line: string): number {
  if (!line) return 0;
  let inside = false;
  let closeChar = '';
  let count = 0;

  for (const ch of line) {
    if (!inside && OPEN_QUOTES.has(ch)) {
      inside = true;
      closeChar = QUOTE_PAIRS.find(p => p[0] === ch)?.[1] ?? '';
      count++;
    } else if (inside && ch === closeChar) {
      inside = false;
      count++;
    } else if (inside) {
      count++;
    }
  }
  return count / line.length;
}

/** Strip outermost matching quote pair */
function stripQuotes(content: string): string {
  for (const [open, close] of QUOTE_PAIRS) {
    if (content.startsWith(open) && content.endsWith(close)) {
      return content.slice(open.length, content.length - close.length);
    }
  }
  return content;
}

/** Split a line into quoted and non-quoted segments */
function splitMixedLine(line: string): string[] {
  const parts: string[] = [];
  let i = 0;
  let current = '';

  while (i < line.length) {
    const ch = line[i];
    if (OPEN_QUOTES.has(ch)) {
      if (current.trim()) parts.push(current.trim());
      current = ch;
      i++;
      const pair = QUOTE_PAIRS.find(p => p[0] === ch);
      const closeCh = pair?.[1] ?? ch;
      // If open and close are the same char (e.g. ASCII ""), toggle on next occurrence
      if (ch === closeCh) {
        while (i < line.length && line[i] !== ch) {
          current += line[i];
          i++;
        }
        if (i < line.length) { current += line[i]; i++; }
      } else {
        let depth = 1;
        while (i < line.length && depth > 0) {
          if (line[i] === ch) depth++;
          else if (line[i] === closeCh) depth--;
          current += line[i];
          i++;
        }
      }
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
      i++;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts.length > 0 ? parts : [line];
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

    // If line contains quotes, always try to split into mixed segments
    if (hasQuote(line)) {
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
