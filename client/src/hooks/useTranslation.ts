import { useState, useRef, useCallback } from 'react';

export interface TranslationState {
  isTranslating: boolean;
  progressText: string | null;
  error: string | null;
  translatedText: string;
  detectedSource: string | null;
  provider: string | null;
}

export function useTranslation() {
  const [state, setState] = useState<TranslationState>({
    isTranslating: false,
    progressText: null,
    error: null,
    translatedText: '',
    detectedSource: null,
    provider: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const translate = useCallback(async (text: string, from: string, to: string) => {
    if (!text || text.trim() === '') {
      setState(prev => ({ ...prev, translatedText: '', error: null }));
      return;
    }

    // Cancel previous inflight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Show long-text chunking hint if > 1000 characters
    const isLongText = text.length > 1000;
    const estChunks = Math.ceil(text.length / 1000);

    setState(prev => ({
      ...prev,
      isTranslating: true,
      error: null,
      progressText: isLongText ? `Processing ${estChunks} sections...` : 'Translating...'
    }));

    try {
      const response = await fetch('/api/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          from,
          to
        }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Translation service is temporarily unavailable. Please try again.');
      }

      setState({
        isTranslating: false,
        progressText: null,
        error: null,
        translatedText: data.translatedText,
        detectedSource: data.detectedSource || null,
        provider: data.provider || 'Translation Engine'
      });

      return data;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Ignored aborted request
        return;
      }
      const msg = err instanceof Error ? err.message : 'Translation could not be completed. Please try again.';
      setState(prev => ({
        ...prev,
        isTranslating: false,
        progressText: null,
        error: msg
      }));
    }
  }, []);

  const detect = useCallback(async (text: string) => {
    if (!text || text.trim().length < 3) return null;

    try {
      const res = await fetch('/api/v1/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  const clearResult = useCallback(() => {
    setState({
      isTranslating: false,
      progressText: null,
      error: null,
      translatedText: '',
      detectedSource: null,
      provider: null
    });
  }, []);

  return {
    ...state,
    translate,
    detect,
    clearResult
  };
}
