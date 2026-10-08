import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, AUTO_DETECT, LanguageConfig } from '../config/languages';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lang: LanguageConfig) => void;
  currentCode: string;
  allowAuto?: boolean;
  title?: string;
  recentCodes: string[];
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentCode,
  allowAuto = false,
  title = 'Select Language',
  recentCodes
}) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'popular' | 'recent'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    let list = SUPPORTED_LANGUAGES;

    if (tab === 'popular') {
      list = list.filter(l => l.popular);
    } else if (tab === 'recent') {
      list = list.filter(l => recentCodes.includes(l.code));
      if (list.length === 0) list = SUPPORTED_LANGUAGES.filter(l => l.popular);
    }

    if (!search.trim()) return list;

    const q = search.toLowerCase().trim();
    return list.filter(
      l => l.name.toLowerCase().includes(q) ||
           l.nativeName.toLowerCase().includes(q) ||
           l.code.toLowerCase().includes(q) ||
           l.script.toLowerCase().includes(q)
    );
  }, [search, tab, recentCodes]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe size={20} color="var(--brand-primary)" />
            <h2 className="modal-title">{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-search-wrapper">
            <Search className="modal-search-icon" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              className="modal-search-input"
              placeholder="Search 100+ languages, native names, or scripts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search languages"
            />
          </div>

          <div className="language-tabs">
            <button
              className={`tab-btn ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              All ({SUPPORTED_LANGUAGES.length})
            </button>
            <button
              className={`tab-btn ${tab === 'popular' ? 'active' : ''}`}
              onClick={() => setTab('popular')}
            >
              Popular
            </button>
            {recentCodes.length > 0 && (
              <button
                className={`tab-btn ${tab === 'recent' ? 'active' : ''}`}
                onClick={() => setTab('recent')}
              >
                Recently Used
              </button>
            )}
          </div>

          {allowAuto && !search && tab === 'all' && (
            <div style={{ marginBottom: '1rem' }}>
              <button
                className={`lang-option-btn ${currentCode === 'auto' ? 'selected' : ''}`}
                style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => {
                  onSelect(AUTO_DETECT);
                  onClose();
                }}
              >
                <div>
                  <div className="lang-primary-name">✨ Auto Detect</div>
                  <div className="lang-nativeName" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Automatically detects source language
                  </div>
                </div>
                {currentCode === 'auto' && <Check size={18} color="var(--brand-primary)" />}
              </button>
            </div>
          )}

          <div className="lang-grid">
            {filteredLanguages.map(lang => {
              const isSelected = lang.code.toLowerCase() === currentCode.toLowerCase();
              return (
                <button
                  key={lang.code}
                  className={`lang-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(lang);
                    onClose();
                  }}
                >
                  <div className="lang-primary-name">
                    <span>{lang.name}</span>
                    {lang.direction === 'rtl' && <span className="rtl-tag">RTL</span>}
                    {isSelected && <Check size={14} color="var(--brand-primary)" />}
                  </div>
                  <div className="lang-native-name">{lang.nativeName}</div>
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              No languages matching "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
