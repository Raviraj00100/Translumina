import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SUPPORTED_LANGUAGES, AUTO_DETECT, getLanguage, isRTL } from '../src/config/languages.js';

describe('Language System Configuration', () => {
  test('supports more than 100 real languages', () => {
    assert.ok(SUPPORTED_LANGUAGES.length >= 100, `Expected at least 100 languages, found ${SUPPORTED_LANGUAGES.length}`);
  });

  test('validates schema of all languages', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      assert.ok(lang.code, `Missing code in language: ${JSON.stringify(lang)}`);
      assert.ok(lang.name, `Missing name in language: ${lang.code}`);
      assert.ok(lang.nativeName, `Missing nativeName in language: ${lang.code}`);
      assert.ok(lang.locale, `Missing locale in language: ${lang.code}`);
      assert.ok(lang.script, `Missing script in language: ${lang.code}`);
      assert.ok(['ltr', 'rtl'].includes(lang.direction), `Invalid direction in language: ${lang.code}`);
      assert.strictEqual(typeof lang.translationSupport, 'boolean');
      assert.strictEqual(typeof lang.speechSupport, 'boolean');
      assert.strictEqual(typeof lang.ocrSupport, 'boolean');
    }
  });

  test('includes key required global languages', () => {
    const requiredCodes = [
      'en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa', 'ur', // Indian languages
      'ar', 'zh-CN', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'tr', 'vi', 'th', 'id' // Global major
    ];

    for (const code of requiredCodes) {
      const found = getLanguage(code);
      assert.ok(found, `Required language '${code}' was not found in catalog.`);
    }
  });

  test('correctly identifies RTL languages', () => {
    assert.strictEqual(isRTL('ar'), true, 'Arabic should be RTL');
    assert.strictEqual(isRTL('ur'), true, 'Urdu should be RTL');
    assert.strictEqual(isRTL('he'), true, 'Hebrew should be RTL');
    assert.strictEqual(isRTL('fa'), true, 'Persian should be RTL');
    assert.strictEqual(isRTL('en'), false, 'English should be LTR');
    assert.strictEqual(isRTL('hi'), false, 'Hindi should be LTR');
  });

  test('Auto detect configuration matches requirements', () => {
    assert.strictEqual(AUTO_DETECT.code, 'auto');
    assert.strictEqual(AUTO_DETECT.translationSupport, true);
  });
});
