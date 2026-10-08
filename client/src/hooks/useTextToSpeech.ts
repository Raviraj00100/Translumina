import { useState, useCallback, useEffect } from 'react';
import { getLanguage } from '../config/languages';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  const speak = useCallback((text: string, langCode: string) => {
    setError(null);

    if (!isSupported) {
      setError('Text-to-speech is not supported in this browser.');
      return;
    }

    if (!text || text.trim() === '') {
      return;
    }

    // Cancel any previous playback
    window.speechSynthesis.cancel();

    const langConfig = getLanguage(langCode);
    const locale = langConfig?.locale || 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding an exact or partial matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      v => v.lang.toLowerCase() === locale.toLowerCase() ||
           v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    } else if (voices.length > 0 && !langConfig?.speechSupport) {
      // If language explicitly has no speech support
      setError(`Speech is not available for this language (${langConfig?.name || langCode}).`);
      return;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      setIsPlaying(false);
      if (e.error !== 'canceled') {
        setError(`Speech error: ${e.error}`);
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err: unknown) {
      setIsPlaying(false);
      const msg = err instanceof Error ? err.message : 'Speech synthesis failed';
      setError(msg);
    }
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isPlaying,
    error,
    isSupported,
    speak,
    stop
  };
}
