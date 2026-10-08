import React, { useState, useEffect, useCallback } from 'react';
import {
  Languages,
  ArrowLeftRight,
  Mic,
  MicOff,
  Camera,
  Copy,
  Check,
  Volume2,
  Square,
  Share2,
  Trash2,
  ClipboardPaste,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Globe2
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, AUTO_DETECT, LanguageConfig, getLanguage, isRTL } from './config/languages';
import { useTranslation } from './hooks/useTranslation';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { CameraModal } from './components/CameraModal';
import { HealthModal } from './components/HealthModal';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('translumina-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('translumina-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Language selections
  const [sourceLang, setSourceLang] = useState<LanguageConfig>(AUTO_DETECT);
  const [targetLang, setTargetLang] = useState<LanguageConfig>(() => {
    const defaultTarget = getLanguage('es') || SUPPORTED_LANGUAGES[0];
    return defaultTarget;
  });

  const [recentCodes, setRecentCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('translumina-recent-langs');
      return saved ? JSON.parse(saved) : ['en', 'es', 'hi', 'ar', 'fr'];
    } catch {
      return ['en', 'es', 'hi', 'ar', 'fr'];
    }
  });

  const addRecentLang = useCallback((code: string) => {
    if (code === 'auto') return;
    setRecentCodes(prev => {
      const filtered = prev.filter(c => c !== code);
      const updated = [code, ...filtered].slice(0, 8);
      localStorage.setItem('translumina-recent-langs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Text state
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Modals state
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Translation hook
  const {
    isTranslating,
    progressText,
    error: translationError,
    translatedText,
    detectedSource,
    provider,
    translate,
    clearResult
  } = useTranslation();

  // Speech Recognition hook
  const handleSpeechResult = useCallback((text: string) => {
    setInputText(prev => (prev ? `${prev} ${text}` : text));
    showToast('Voice input captured successfully', 'success');
  }, [showToast]);

  const {
    isListening,
    error: speechError,
    startListening,
    stopListening
  } = useSpeechRecognition(handleSpeechResult);

  useEffect(() => {
    if (speechError) {
      showToast(speechError, 'error');
    }
  }, [speechError, showToast]);

  // Text-to-Speech hook
  const {
    isPlaying: isTtsPlaying,
    error: ttsError,
    speak: speakText,
    stop: stopTts
  } = useTextToSpeech();

  useEffect(() => {
    if (ttsError) {
      showToast(ttsError, 'error');
    }
  }, [ttsError, showToast]);

  // Perform Translation
  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;
    addRecentLang(sourceLang.code);
    addRecentLang(targetLang.code);
    await translate(inputText, sourceLang.code, targetLang.code);
  }, [inputText, sourceLang.code, targetLang.code, translate, addRecentLang]);

  // Swap Languages
  const handleSwap = () => {
    if (sourceLang.code === 'auto') {
      if (detectedSource) {
        const detectedConfig = getLanguage(detectedSource);
        if (detectedConfig) {
          const oldTarget = targetLang;
          setSourceLang(oldTarget);
          setTargetLang(detectedConfig);
          if (translatedText) {
            setInputText(translatedText);
            clearResult();
          }
          return;
        }
      }
      showToast('Cannot swap when source is in Auto Detect mode', 'info');
      return;
    }

    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    if (translatedText) {
      setInputText(translatedText);
      clearResult();
    }
  };

  // Copy translated text
  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      showToast('Copied to clipboard ✓', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Unable to copy to clipboard', 'error');
    }
  };

  // Paste text
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(prev => prev ? `${prev}\n${text}` : text);
        showToast('Pasted from clipboard', 'info');
      }
    } catch {
      showToast('Clipboard read access was blocked by browser', 'error');
    }
  };

  // Clear text
  const handleClear = () => {
    setInputText('');
    clearResult();
    stopTts();
  };

  // Share translation
  const handleShare = async () => {
    if (!translatedText) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Translation via TransLumina',
          text: `${inputText}\n\n→ [${targetLang.name}]:\n${translatedText}`
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      const langForSpeech = sourceLang.code === 'auto' ? 'en' : sourceLang.code;
      startListening(langForSpeech);
    }
  };

  // Toggle TTS
  const toggleTts = () => {
    if (isTtsPlaying) {
      stopTts();
    } else if (translatedText) {
      speakText(translatedText, targetLang.code);
    }
  };

  const isSourceRTL = isRTL(sourceLang.code === 'auto' ? (detectedSource || 'en') : sourceLang.code);
  const isTargetRTL = isRTL(targetLang.code);

  const detectedLanguageName = detectedSource ? getLanguage(detectedSource)?.name || detectedSource : null;

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Globe2 size={24} />
          </div>
          <div>
            <h1 className="brand-title">TransLumina</h1>
            <div className="brand-subtitle">Production Translation Platform</div>
          </div>
        </div>

        <div className="header-controls">
          <button
            className="status-badge"
            onClick={() => setIsHealthModalOpen(true)}
            title="View backend status & provider metrics"
            aria-label="System status"
          >
            <span className="status-dot"></span>
            <span>API Operational</span>
          </button>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Translation Cards Grid */}
      <main className="translation-grid">
        {/* Source Card */}
        <section className="translate-card" aria-label="Source Language and Input">
          <div className="card-header">
            <button
              className="lang-selector-trigger"
              onClick={() => setIsSourceModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isSourceModalOpen}
            >
              <Languages size={18} color="var(--brand-primary)" />
              <span>{sourceLang.name}</span>
              {sourceLang.direction === 'rtl' && <span className="rtl-tag">RTL</span>}
              <ChevronDown size={14} />
            </button>

            {sourceLang.code === 'auto' && detectedLanguageName && (
              <span className="detected-pill" title={`Confidence detected: ${detectedLanguageName}`}>
                Detected: {detectedLanguageName}
              </span>
            )}
          </div>

          <div className="card-body">
            <textarea
              className={`translate-textarea ${isSourceRTL ? 'rtl-text' : ''}`}
              dir={isSourceRTL ? 'rtl' : 'ltr'}
              placeholder="Type, paste, or use voice/camera to input text..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              aria-label="Source text to translate"
              maxLength={25000}
            />
          </div>

          <div className="card-footer">
            <div className="action-group">
              <button
                className={`tool-btn ${isListening ? 'listening-active' : ''}`}
                onClick={toggleVoiceInput}
                title={isListening ? 'Stop listening' : 'Dictate with microphone (Voice input)'}
                aria-label={isListening ? 'Stop speech recognition' : 'Start speech recognition'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Listening...' : 'Voice'}</span>
              </button>

              <button
                className="tool-btn"
                onClick={() => setIsCameraModalOpen(true)}
                title="Translate from camera photo or image (OCR)"
                aria-label="Open camera and OCR translation"
              >
                <Camera size={16} />
                <span>Camera</span>
              </button>

              <button
                className="tool-btn"
                onClick={handlePaste}
                title="Paste from clipboard"
                aria-label="Paste text from clipboard"
              >
                <ClipboardPaste size={16} />
                <span>Paste</span>
              </button>

              {inputText && (
                <button
                  className="tool-btn"
                  onClick={handleClear}
                  title="Clear input text"
                  aria-label="Clear source text"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="char-counter">
              {inputText.length.toLocaleString()} / 25,000
            </div>
          </div>
        </section>

        {/* Center Swap Action */}
        <div className="swap-column">
          <button
            className="swap-btn"
            onClick={handleSwap}
            disabled={sourceLang.code === 'auto' && !detectedSource}
            title={sourceLang.code === 'auto' && !detectedSource ? 'Auto-detect must resolve before swapping' : 'Swap source and target languages'}
            aria-label="Swap source and target languages"
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>

        {/* Target Card */}
        <section className="translate-card" aria-label="Target Language and Translation Output">
          <div className="card-header">
            <button
              className="lang-selector-trigger"
              onClick={() => setIsTargetModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isTargetModalOpen}
            >
              <Languages size={18} color="var(--brand-primary)" />
              <span>{targetLang.name}</span>
              {targetLang.direction === 'rtl' && <span className="rtl-tag">RTL</span>}
              <ChevronDown size={14} />
            </button>

            {provider && (
              <span className="detected-pill" style={{ background: 'var(--bg-surface)' }}>
                Via {provider}
              </span>
            )}
          </div>

          <div className="card-body">
            {translatedText ? (
              <div
                className={`translation-output ${isTargetRTL ? 'rtl-text' : ''}`}
                dir={isTargetRTL ? 'rtl' : 'ltr'}
                aria-live="polite"
              >
                {translatedText}
              </div>
            ) : isTranslating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-primary)', margin: 'auto' }}>
                <div className="spinner" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}></div>
                <span>Translating content...</span>
              </div>
            ) : (
              <div className="translation-output empty-state-text">
                Translation will appear here instantly...
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="action-group">
              <button
                className={`tool-btn ${copied ? 'active' : ''}`}
                onClick={handleCopy}
                disabled={!translatedText}
                title="Copy translated text"
                aria-label="Copy translation to clipboard"
              >
                {copied ? <Check size={16} color="var(--accent-success)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied ✓' : 'Copy'}</span>
              </button>

              <button
                className={`tool-btn ${isTtsPlaying ? 'active' : ''}`}
                onClick={toggleTts}
                disabled={!translatedText}
                title={isTtsPlaying ? 'Stop reading' : 'Listen to translation (Text-To-Speech)'}
                aria-label={isTtsPlaying ? 'Stop speech playback' : 'Listen to translated speech'}
              >
                {isTtsPlaying ? <Square size={16} /> : <Volume2 size={16} />}
                <span>{isTtsPlaying ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                className="tool-btn"
                onClick={handleShare}
                disabled={!translatedText}
                title="Share translation"
                aria-label="Share translation"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Main Action Bar */}
      <div className="main-action-bar">
        {progressText && (
          <div className="progress-banner">
            <Sparkles size={16} />
            <span>{progressText}</span>
          </div>
        )}

        {translationError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', background: 'var(--accent-danger-bg)', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-lg)', maxWidth: '600px', textAlign: 'center' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.9rem' }}>{translationError}</span>
            <button className="tool-btn" onClick={handleTranslate} style={{ marginLeft: '0.5rem', color: 'var(--accent-danger)' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        <button
          className="translate-btn-main"
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          aria-label="Perform translation"
        >
          {isTranslating ? (
            <>
              <div className="spinner"></div>
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>Translate</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <LanguageSelectorModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onSelect={setSourceLang}
        currentCode={sourceLang.code}
        allowAuto={true}
        title="Select Source Language"
        recentCodes={recentCodes}
      />

      <LanguageSelectorModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        onSelect={setTargetLang}
        currentCode={targetLang.code}
        allowAuto={false}
        title="Select Target Language"
        recentCodes={recentCodes}
      />

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onTextExtracted={(text) => {
          setInputText(text);
          // Automatically trigger translation for seamless camera UX
          translate(text, sourceLang.code, targetLang.code);
        }}
      />

      <HealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.type === 'success' && <Check size={18} />}
            {toastMessage.type === 'error' && <AlertCircle size={18} />}
            {toastMessage.type === 'info' && <Sparkles size={18} />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
