export interface TranslationResult {
  text: string;
  detectedSource?: string;
  provider: string;
}

export interface DetectionResult {
  language: string;
  confident: boolean;
  score?: number;
  message?: string;
}

export interface ITranslationProvider {
  name: string;
  isAvailable(): boolean;
  translate(text: string, from: string, to: string): Promise<TranslationResult>;
  detect(text: string): Promise<DetectionResult>;
}
