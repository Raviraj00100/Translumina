import { test, describe } from 'node:test';
import assert from 'node:assert';
import { splitIntoChunks, reassembleChunks } from '../src/utils/chunker.js';

describe('Text Chunking Engine', () => {
  test('does not split short text under limit', () => {
    const text = 'Hello world, this is a short text.';
    const chunks = splitIntoChunks(text, 100);
    assert.strictEqual(chunks.length, 1);
    assert.strictEqual(chunks[0], text);
  });

  test('splits multi-paragraph text preserving paragraphs', () => {
    const p1 = 'Paragraph one with some text to expand.';
    const p2 = 'Paragraph two with more details here.';
    const text = `${p1}\n\n${p2}`;
    const chunks = splitIntoChunks(text, 50);
    assert.strictEqual(chunks.length >= 2, true);
    const reassembled = reassembleChunks(chunks);
    assert.strictEqual(reassembled, text);
  });

  test('safely handles multilingual unicode text (Hindi, Arabic, Emoji)', () => {
    const text = 'नमस्ते दुनिया! 🌍\n\nالسلام عليكم ورحمة الله وبركاته ❤️\n\n你好，世界！🚀';
    const chunks = splitIntoChunks(text, 40);
    const reassembled = reassembleChunks(chunks);
    assert.strictEqual(reassembled, text);
  });
});
