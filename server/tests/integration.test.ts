import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TranslationManager } from '../src/providers/TranslationManager.js';

describe('Real Live Translation & Detection Integration', () => {
  const manager = new TranslationManager();

  test('Auto-detects French, Hindi, and Arabic', async () => {
    const resFr = await manager.detect('Bonjour tout le monde, comment allez-vous?');
    assert.strictEqual(resFr.confident, true);
    assert.strictEqual(resFr.language, 'fr');

    const resHi = await manager.detect('नमस्ते, आज का दिन कैसा है?');
    assert.strictEqual(resHi.confident, true);
    assert.strictEqual(resHi.language, 'hi');

    const resAr = await manager.detect('السلام عليكم ورحمة الله');
    assert.strictEqual(resAr.confident, true);
    assert.strictEqual(resAr.language, 'ar');
  });

  test('Returns non-confident message for ambiguous or ultra-short input', async () => {
    const resShort = await manager.detect('a');
    assert.strictEqual(resShort.confident, false);
    assert.ok(resShort.message?.includes('Language could not be confidently detected'));

    const resNumbers = await manager.detect('12345 67890');
    assert.strictEqual(resNumbers.confident, false);
  });

  test('Real translation: English -> Spanish and English -> German', async () => {
    const resEs = await manager.translate('Hello world! Welcome to our platform.', 'en', 'es');
    assert.ok(resEs.text.length > 0);
    assert.ok(resEs.text.toLowerCase().includes('hola') || resEs.text.toLowerCase().includes('mundo') || resEs.text.toLowerCase().includes('bienvenido'));

    const resDe = await manager.translate('Good morning, how are you today?', 'en', 'de');
    assert.ok(resDe.text.length > 0);
    assert.ok(resDe.text.toLowerCase().includes('morgen') || resDe.text.toLowerCase().includes('tag') || resDe.text.toLowerCase().includes('wie'));
  });

  test('Real translation: English -> Hindi and Hindi -> English', async () => {
    const resHi = await manager.translate('Thank you very much', 'en', 'hi');
    assert.ok(resHi.text.length > 0);

    const resEn = await manager.translate('धन्यवाद और आपका स्वागत है', 'hi', 'en');
    assert.ok(resEn.text.length > 0);
    assert.ok(resEn.text.toLowerCase().includes('thank') || resEn.text.toLowerCase().includes('welcome'));
  });

  test('Real translation: English -> Arabic (RTL) and Arabic -> English', async () => {
    const resAr = await manager.translate('Peace and prosperity to everyone', 'en', 'ar');
    assert.ok(resAr.text.length > 0);

    const resEn = await manager.translate('السلام عليكم', 'ar', 'en');
    assert.ok(resEn.text.length > 0);
    assert.ok(resEn.text.toLowerCase().includes('peace') || resEn.text.toLowerCase().includes('hello'));
  });

  test('Real translation: Chinese -> English and Japanese -> English', async () => {
    const resZh = await manager.translate('人工智能正在改变世界', 'zh-CN', 'en');
    assert.ok(resZh.text.toLowerCase().includes('intelligence') || resZh.text.toLowerCase().includes('world'));

    const resJa = await manager.translate('こんにちは世界', 'ja', 'en');
    assert.ok(resJa.text.toLowerCase().includes('hello') || resJa.text.toLowerCase().includes('world'));
  });

  test('Preserves emojis and numbers in translation', async () => {
    const textWithEmoji = 'Flight 402 departing at 10:30 AM ✈️🌍';
    const res = await manager.translate(textWithEmoji, 'en', 'fr');
    assert.ok(res.text.includes('402'));
    assert.ok(res.text.includes('✈️') || res.text.includes('🌍'));
  });
});
