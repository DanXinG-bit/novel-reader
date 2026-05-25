import { describe, test, expect } from 'vitest';
import { parseText } from '../../src/core/parser';

describe('parser', () => {
  test('纯旁白文本不产生 dialogue 段落', () => {
    const result = parseText('这是一个普通的叙述段落。\n这也是普通的叙述。');
    expect(result.every(p => p.type !== 'dialogue')).toBe(true);
  });

  test('标准中文弯引号识别为对话', () => {
    const result = parseText('"你好，世界。"');
    expect(result[0].type).toBe('dialogue');
    expect(result[0].content).toBe('你好，世界。');
  });

  test('英文直引号识别为对话', () => {
    const result = parseText('"Hello world."');
    expect(result[0].type).toBe('dialogue');
    expect(result[0].content).toBe('Hello world.');
  });

  test('日式引号识别为对话', () => {
    const result = parseText('「こんにちは」');
    expect(result[0].type).toBe('dialogue');
  });

  test('日式双引号识别为对话', () => {
    const result = parseText('『标题』');
    expect(result[0].type).toBe('dialogue');
  });

  test('一行混合旁白和对话被拆分', () => {
    const result = parseText('他说"走吧"然后离开了。');
    const types = result.map(p => p.type);
    expect(types).toContain('narration');
    expect(types).toContain('dialogue');
  });

  test('章节标题被识别为 title 类型', () => {
    const result = parseText('第一章 开始');
    expect(result[0].type).toBe('title');
  });

  test('中文数字章节标题识别', () => {
    const result = parseText('第十二回 大结局');
    expect(result[0].type).toBe('title');
  });

  test('空行被过滤', () => {
    const result = parseText('第一行\n\n\n第二行');
    expect(result.length).toBe(2);
  });

  test('段落 index 顺序正确', () => {
    const result = parseText('第一段\n第二段\n第三段');
    expect(result[0].index).toBe(0);
    expect(result[1].index).toBe(1);
    expect(result[2].index).toBe(2);
  });

  test('每个段落有唯一 id', () => {
    const result = parseText('段落一\n段落二\n段落三');
    const ids = result.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
