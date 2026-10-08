import { ITranslationProvider, TranslationResult, DetectionResult } from './BaseProvider.js';
import { translate as googleTranslate } from 'google-translate-api-x';

export class GoogleProvider implements ITranslationProvider {
  public name = 'Google';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  isAvailable(): boolean {
    return true;
  }

  async translate(text: string, from: string, to: string): Promise<TranslationResult> {
    if (!text || text.trim() === '') {
      return { text: '', detectedSource: from, provider: this.name };
    }

    // Map custom codes if necessary
    const source = from === 'auto' ? 'auto' : from;
    const target = to;

    try {
      const options: Record<string, unknown> = {
        to: target,
        from: source === 'auto' ? 'auto' : source,
        forceBatch: false,
        rejectOnPartialFail: false
      };

      const res = await googleTranslate(text, options);
      const translatedText = res.text || '';
      const detectedSource = res.from?.language?.iso || from;

      return {
        text: translatedText,
        detectedSource,
        provider: this.name
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      throw new Error(`Google translation error: ${errorMsg}`);
    }
  }

  async detect(text: string): Promise<DetectionResult> {
    const trimmed = text.trim();
    // Too short (less than 3 chars) or only punctuation/numbers: not confident
    if (trimmed.length < 3 || /^[\d\s\p{P}]+$/u.test(trimmed)) {
      return {
        language: '',
        confident: false,
        message: 'Language could not be confidently detected. Please select the source language manually.'
      };
    }

    try {
      const res = await googleTranslate(trimmed, { to: 'en' });
      const detectedIso = res.from?.language?.iso;
      if (detectedIso && detectedIso !== 'auto') {
        return {
          language: detectedIso,
          confident: true,
          score: 0.95
        };
      }
      return {
        language: '',
        confident: false,
        message: 'Language could not be confidently detected. Please select the source language manually.'
      };
    } catch {
      return {
        language: '',
        confident: false,
        message: 'Language could not be confidently detected. Please select the source language manually.'
      };
    }
  }
}
