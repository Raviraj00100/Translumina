import { ITranslationProvider, TranslationResult, DetectionResult } from './BaseProvider.js';
import { GoogleProvider } from './GoogleProvider.js';
import { MyMemoryProvider } from './MyMemoryProvider.js';
import { AzureProvider, DeepLProvider } from './CloudProviders.js';
import { splitIntoChunks, reassembleChunks } from '../utils/chunker.js';

export interface ManagerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalLatencyMs: number;
  lastError?: string;
  providerUsage: Record<string, number>;
}

export class TranslationManager {
  private providers: ITranslationProvider[] = [];
  private metrics: ManagerMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalLatencyMs: 0,
    providerUsage: {}
  };

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // 1. Check for DeepL key
    if (process.env.DEEPL_API_KEY) {
      this.providers.push(new DeepLProvider());
    }

    // 2. Check for Azure key
    if (process.env.AZURE_TRANSLATOR_KEY) {
      this.providers.push(new AzureProvider());
    }

    // 3. Primary Google Provider (supports 130+ languages out-of-the-box)
    this.providers.push(new GoogleProvider());

    // 4. Secondary fallback: MyMemory Provider
    this.providers.push(new MyMemoryProvider());
  }

  public getMetrics(): ManagerMetrics & { averageLatencyMs: number; activeProviders: string[] } {
    const avg = this.metrics.totalRequests > 0
      ? Math.round(this.metrics.totalLatencyMs / this.metrics.totalRequests)
      : 0;

    return {
      ...this.metrics,
      averageLatencyMs: avg,
      activeProviders: this.providers.map(p => p.name)
    };
  }

  /**
   * Translates text with automatic chunking and fallback handling
   */
  async translate(
    text: string,
    from: string,
    to: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<TranslationResult & { chunksProcessed: number }> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    const chunks = splitIntoChunks(text, 1000);
    const translatedChunks: string[] = [];
    let detectedSource = from;
    let providerUsed = 'Google';

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (onProgress) {
          onProgress(i + 1, chunks.length);
        }

        const chunkResult = await this.translateSingleChunkWithFallback(chunk, from, to);
        translatedChunks.push(chunkResult.text);
        if (chunkResult.detectedSource && detectedSource === 'auto') {
          detectedSource = chunkResult.detectedSource;
        }
        providerUsed = chunkResult.provider;
      }

      const fullResult = reassembleChunks(translatedChunks);
      const latency = Date.now() - startTime;
      this.metrics.successfulRequests++;
      this.metrics.totalLatencyMs += latency;
      this.metrics.providerUsage[providerUsed] = (this.metrics.providerUsage[providerUsed] || 0) + 1;

      return {
        text: fullResult,
        detectedSource,
        provider: providerUsed,
        chunksProcessed: chunks.length
      };
    } catch (err: unknown) {
      this.metrics.failedRequests++;
      this.metrics.lastError = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  private async translateSingleChunkWithFallback(
    chunk: string,
    from: string,
    to: string
  ): Promise<TranslationResult> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      try {
        const res = await provider.translate(chunk, from, to);
        if (res && res.text !== undefined) {
          return res;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${provider.name}: ${msg}`);
        // Continue to next provider in fallback chain
      }
    }

    throw new Error(`All translation providers failed. (${errors.join('; ')})`);
  }

  /**
   * Detects language using provider chain
   */
  async detect(text: string): Promise<DetectionResult> {
    const trimmed = text.trim();
    if (trimmed.length < 3 || /^[\d\s\p{P}]+$/u.test(trimmed)) {
      return {
        language: '',
        confident: false,
        message: 'Language could not be confidently detected. Please select the source language manually.'
      };
    }

    for (const provider of this.providers) {
      try {
        const result = await provider.detect(trimmed);
        if (result.confident) {
          return result;
        }
      } catch {
        // Continue
      }
    }

    return {
      language: '',
      confident: false,
      message: 'Language could not be confidently detected. Please select the source language manually.'
    };
  }
}
