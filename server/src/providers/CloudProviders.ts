import { ITranslationProvider, TranslationResult, DetectionResult } from './BaseProvider.js';

export class AzureProvider implements ITranslationProvider {
  public name = 'Azure';
  private key?: string;
  private region?: string;
  private endpoint?: string;

  constructor(key?: string, region = 'global', endpoint = 'https://api.cognitive.microsofttranslator.com') {
    this.key = key || process.env.AZURE_TRANSLATOR_KEY;
    this.region = region || process.env.AZURE_TRANSLATOR_REGION || 'global';
    this.endpoint = endpoint || process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
  }

  isAvailable(): boolean {
    return !!this.key;
  }

  async translate(text: string, from: string, to: string): Promise<TranslationResult> {
    if (!this.key) throw new Error('Azure Translator key is not configured');

    const fromParam = from === 'auto' ? '' : `&from=${from}`;
    const url = `${this.endpoint}/translate?api-version=3.0${fromParam}&to=${to}`;

    const headers: Record<string, string> = {
      'Ocp-Apim-Subscription-Key': this.key,
      'Content-Type': 'application/json'
    };
    if (this.region) {
      headers['Ocp-Apim-Subscription-Region'] = this.region;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ text }])
    });

    if (!res.ok) {
      throw new Error(`Azure HTTP error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as Array<{
      detectedLanguage?: { language: string; score: number };
      translations: Array<{ text: string; to: string }>;
    }>;

    const first = data[0];
    return {
      text: first.translations[0]?.text || '',
      detectedSource: first.detectedLanguage?.language || from,
      provider: this.name
    };
  }

  async detect(text: string): Promise<DetectionResult> {
    if (!this.key) {
      return { language: '', confident: false, message: 'Azure not configured' };
    }

    const url = `${this.endpoint}/detect?api-version=3.0`;
    const headers: Record<string, string> = {
      'Ocp-Apim-Subscription-Key': this.key,
      'Content-Type': 'application/json'
    };
    if (this.region) {
      headers['Ocp-Apim-Subscription-Region'] = this.region;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ text }])
    });

    if (!res.ok) {
      return { language: '', confident: false, message: 'Detection request failed' };
    }

    const data = await res.json() as Array<{ language: string; score: number; isTranslationSupported: boolean }>;
    const match = data[0];
    if (match && match.score > 0.6) {
      return {
        language: match.language,
        confident: true,
        score: match.score
      };
    }

    return {
      language: '',
      confident: false,
      message: 'Language could not be confidently detected. Please select the source language manually.'
    };
  }
}

export class DeepLProvider implements ITranslationProvider {
  public name = 'DeepL';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPL_API_KEY;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async translate(text: string, from: string, to: string): Promise<TranslationResult> {
    if (!this.apiKey) throw new Error('DeepL API key not configured');

    const isFree = this.apiKey.endsWith(':fx');
    const endpoint = isFree ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', to.toUpperCase());
    if (from !== 'auto') {
      params.append('source_lang', from.toUpperCase());
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!res.ok) {
      throw new Error(`DeepL HTTP error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as {
      translations: Array<{ detected_source_language: string; text: string }>;
    };

    const first = data.translations[0];
    return {
      text: first.text,
      detectedSource: first.detected_source_language.toLowerCase(),
      provider: this.name
    };
  }

  async detect(): Promise<DetectionResult> {
    return {
      language: '',
      confident: false,
      message: 'DeepL detection standalone not supported'
    };
  }
}
