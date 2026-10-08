import { test, describe } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:5050';

describe('End-to-End Production API Verification', () => {
  test('Root HTML is served with SEO tags and scripts', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('<title>TransLumina'), 'HTML must include TransLumina title');
    assert.ok(html.includes('Plus+Jakarta+Sans'), 'HTML must include Plus Jakarta Sans font');
    assert.ok(html.includes('index-'), 'HTML must link to compiled production JS bundle');
  });

  test('Health endpoint returns healthy status and metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.ok(data.providers.active.length >= 2, 'Must have at least 2 active providers');
    assert.strictEqual(typeof data.metrics.totalRequests, 'number');
  });

  test('Language catalog endpoint returns 100+ languages with RTL metadata', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/languages`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.total >= 100, `Expected >= 100 languages, got ${data.total}`);
    const arabic = data.languages.find((l: { code: string }) => l.code === 'ar');
    assert.strictEqual(arabic.direction, 'rtl');
  });

  test('Live Translation: English -> Japanese', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Thank you for your assistance',
        from: 'en',
        to: 'ja'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.translatedText.length > 0);
  });

  test('Live Translation: English -> Tamil', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Welcome to our platform',
        from: 'en',
        to: 'ta'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.translatedText.length > 0);
  });

  test('Live Translation: Auto-detection with Spanish -> English', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Muchas gracias por su amable ayuda',
        from: 'auto',
        to: 'en'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.detectedSource, 'es');
    assert.ok(data.translatedText.toLowerCase().includes('thank') || data.translatedText.toLowerCase().includes('help'));
  });

  test('OCR endpoint rejects empty image gracefully', async () => {
    const emptyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    const res = await fetch(`${BASE_URL}/api/v1/ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64: emptyPng.toString('base64'),
        ocrLanguage: 'eng'
      })
    });
    assert.strictEqual(res.status, 422);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, 'No readable text found. Try another image.');
  });
});
