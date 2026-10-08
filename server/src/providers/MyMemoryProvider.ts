import { ITranslationProvider, TranslationResult, DetectionResult } from './BaseProvider.js';

export class MyMemoryProvider implements ITranslationProvider {
  public name = 'MyMemory';
  private email?: string;
  private apiKey?: string;

  constructor(email?: string, apiKey?: string) {
    this.email = email || process.env.MYMEMORY_EMAIL;
    this.apiKey = apiKey || process.env.MYMEMORY_API_KEY;
  }

  isAvailable(): boolean {
    return true;
  }

  async translate(text: string, from: string, to: string): Promise<TranslationResult> {
    if (!text || text.trim() === '') {
      return { text: '', detectedSource: from, provider: this.name };
    }

    const source = from === 'auto' ? 'en' : from;
    const pair = `${source}|${to}`;
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`;

    if (this.email) {
      url += `&de=${encodeURIComponent(this.email)}`;
    }
    if (this.apiKey) {
      url += `&key=${encodeURIComponent(this.apiKey)}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`MyMemory HTTP error: ${response.status}`);
      }

      const data = await response.json() as {
        responseData?: { translatedText?: string; match?: number };
        responseStatus?: number;
        responseDetails?: string;
      };

      if (data.responseStatus !== 200 && data.responseStatus !== 206) {
        throw new Error(data.responseDetails || `MyMemory error code ${data.responseStatus}`);
      }

      const translated = data.responseData?.translatedText || '';
      return {
        text: translated,
        detectedSource: from,
        provider: this.name
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const errorMsg = err instanceof Error ? err.message : String(err);
      throw new Error(`MyMemory provider error: ${errorMsg}`);
    }
  }

  async detect(text: string): Promise<DetectionResult> {
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      return {
        language: '',
        confident: false,
        message: 'Language could not be confidently detected. Please select the source language manually.'
      };
    }

    // MyMemory doesn't have an isolated detection endpoint, so return ambiguous
    return {
      language: '',
      confident: false,
      message: 'Language could not be confidently detected. Please select the source language manually.'
    };
  }
}
