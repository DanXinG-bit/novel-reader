import { describe, test, expect } from 'vitest';
import { detectSpeaker } from '../../src/core/speakerDetector';

describe('speakerDetector', () => {
  test('冒号前缀模式识别说话者', () => {
    const result = detectSpeaker('小明："我不知道。"', ['小明："我不知道。"'], 0);
    expect(result.name).toBe('小明');
    expect(result.confidence).toBe('auto');
    expect(result.matchedRule).toBe(1);
  });

  test('英文冒号前缀模式识别说话者', () => {
    const result = detectSpeaker('小红: "Hello."', ['小红: "Hello."'], 0);
    expect(result.name).toBe('小红');
    expect(result.confidence).toBe('auto');
  });

  test('对话前动词标签识别（本行）', () => {
    const result = detectSpeaker('小红道："你去哪里？"', ['小红道："你去哪里？"'], 0);
    expect(result.name).toBe('小红');
    expect(result.confidence).toBe('auto');
  });

  test('对话后动词标签识别（本行）', () => {
    const result = detectSpeaker('"走吧。"小明说。', ['"走吧。"小明说。'], 0);
    expect(result.name).toBe('小明');
    expect(result.confidence).toBe('auto');
    expect(result.matchedRule).toBe(3);
  });

  test('上一行冒号前缀识别说话者', () => {
    const lines = ['小明：', '"我知道了。"'];
    const result = detectSpeaker('"我知道了。"', lines, 1);
    expect(result.name).toBe('小明');
    expect(result.confidence).toBe('auto');
  });

  test('无法识别时返回 null + unknown', () => {
    const result = detectSpeaker('"……"', ['"……"'], 0);
    expect(result.name).toBeNull();
    expect(result.confidence).toBe('unknown');
    expect(result.matchedRule).toBe(4);
  });

  test('低声道动词标签识别', () => {
    const result = detectSpeaker('她低声道："别走。"', ['她低声道："别走。"'], 0);
    expect(result.name).toBe('她');
    expect(result.confidence).toBe('auto');
  });

  test('轻声道动词标签识别', () => {
    const result = detectSpeaker('他轻声道："晚安。"', ['他轻声道："晚安。"'], 0);
    expect(result.name).toBe('他');
  });
});
