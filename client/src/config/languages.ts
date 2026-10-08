export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  script: string;
  direction: 'ltr' | 'rtl';
  translationSupport: boolean;
  speechSupport: boolean;
  ocrSupport: boolean;
  popular?: boolean;
}

export const AUTO_DETECT: LanguageConfig = {
  code: 'auto',
  name: 'Auto Detect',
  nativeName: 'Auto Detect',
  locale: 'en-US',
  script: 'Latin',
  direction: 'ltr',
  translationSupport: true,
  speechSupport: false,
  ocrSupport: false
};

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  // --- Popular / High-frequency global languages ---
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-US',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    locale: 'es-ES',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    locale: 'fr-FR',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    locale: 'de-DE',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    locale: 'hi-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    locale: 'ar-SA',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    locale: 'zh-CN',
    script: 'Han',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    locale: 'zh-TW',
    script: 'Han',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    locale: 'ja-JP',
    script: 'Japanese',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    locale: 'ko-KR',
    script: 'Hangul',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    locale: 'pt-PT',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    locale: 'ru-RU',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    locale: 'it-IT',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },

  // --- Indian Languages ---
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    locale: 'ta-IN',
    script: 'Tamil',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    locale: 'te-IN',
    script: 'Telugu',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    locale: 'bn-IN',
    script: 'Bengali',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    locale: 'mr-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    locale: 'gu-IN',
    script: 'Gujarati',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    locale: 'kn-IN',
    script: 'Kannada',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    locale: 'ml-IN',
    script: 'Malayalam',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    locale: 'pa-IN',
    script: 'Gurmukhi',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    locale: 'ur-PK',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    locale: 'or-IN',
    script: 'Odia',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    locale: 'as-IN',
    script: 'Bengali',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    locale: 'sa-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    locale: 'ne-NP',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'si',
    name: 'Sinhala',
    nativeName: 'සිංහල',
    locale: 'si-LK',
    script: 'Sinhala',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },

  // --- Asian & Southeast Asian Languages ---
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    locale: 'tr-TR',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    locale: 'vi-VN',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    locale: 'th-TH',
    script: 'Thai',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    locale: 'id-ID',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    locale: 'ms-MY',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'tl',
    name: 'Filipino (Tagalog)',
    nativeName: 'Tagalog',
    locale: 'fil-PH',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'my',
    name: 'Burmese (Myanmar)',
    nativeName: 'မြန်မာဘာသာ',
    locale: 'my-MM',
    script: 'Myanmar',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'km',
    name: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    locale: 'km-KH',
    script: 'Khmer',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'lo',
    name: 'Lao',
    nativeName: 'ພາສາລາວ',
    locale: 'lo-LA',
    script: 'Lao',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'mn',
    name: 'Mongolian',
    nativeName: 'Монгол',
    locale: 'mn-MN',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },

  // --- Middle Eastern Languages ---
  {
    code: 'fa',
    name: 'Persian (Farsi)',
    nativeName: 'فارسی',
    locale: 'fa-IR',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    locale: 'he-IL',
    script: 'Hebrew',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'ku',
    name: 'Kurdish (Kurmanji)',
    nativeName: 'Kurdî',
    locale: 'ku-TR',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ps',
    name: 'Pashto',
    nativeName: 'پښتو',
    locale: 'ps-AF',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'az',
    name: 'Azerbaijani',
    nativeName: 'Azərbaycan dili',
    locale: 'az-AZ',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'hy',
    name: 'Armenian',
    nativeName: 'Հայերեն',
    locale: 'hy-AM',
    script: 'Armenian',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ka',
    name: 'Georgian',
    nativeName: 'ქართული',
    locale: 'ka-GE',
    script: 'Georgian',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },

  // --- European Languages ---
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    locale: 'nl-NL',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    locale: 'pl-PL',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    locale: 'uk-UA',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    locale: 'el-GR',
    script: 'Greek',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
    locale: 'cs-CZ',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    locale: 'sv-SE',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    locale: 'ro-RO',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'hu',
    name: 'Hungarian',
    nativeName: 'Magyar',
    locale: 'hu-HU',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    locale: 'da-DK',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    locale: 'fi-FI',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    locale: 'nb-NO',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'sk',
    name: 'Slovak',
    nativeName: 'Slovenčina',
    locale: 'sk-SK',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    nativeName: 'Български',
    locale: 'bg-BG',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'hr',
    name: 'Croatian',
    nativeName: 'Hrvatski',
    locale: 'hr-HR',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName: 'Српски',
    locale: 'sr-RS',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'lt',
    name: 'Lithuanian',
    nativeName: 'Lietuvių',
    locale: 'lt-LT',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'sl',
    name: 'Slovenian',
    nativeName: 'Slovenščina',
    locale: 'sl-SI',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'et',
    name: 'Estonian',
    nativeName: 'Eesti',
    locale: 'et-EE',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'lv',
    name: 'Latvian',
    nativeName: 'Latviešu',
    locale: 'lv-LV',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'be',
    name: 'Belarusian',
    nativeName: 'Беларуская',
    locale: 'be-BY',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'mk',
    name: 'Macedonian',
    nativeName: 'Македонски',
    locale: 'mk-MK',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'sq',
    name: 'Albanian',
    nativeName: 'Shqip',
    locale: 'sq-AL',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'bs',
    name: 'Bosnian',
    nativeName: 'Bosanski',
    locale: 'bs-BA',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'is',
    name: 'Icelandic',
    nativeName: 'Íslenska',
    locale: 'is-IS',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ga',
    name: 'Irish',
    nativeName: 'Gaeilge',
    locale: 'ga-IE',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'cy',
    name: 'Welsh',
    nativeName: 'Cymraeg',
    locale: 'cy-GB',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'eu',
    name: 'Basque',
    nativeName: 'Euskara',
    locale: 'eu-ES',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'gl',
    name: 'Galician',
    nativeName: 'Galego',
    locale: 'gl-ES',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ca',
    name: 'Catalan',
    nativeName: 'Català',
    locale: 'ca-ES',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'mt',
    name: 'Maltese',
    nativeName: 'Malti',
    locale: 'mt-MT',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'lb',
    name: 'Luxembourgish',
    nativeName: 'Lëtzebuergesch',
    locale: 'lb-LU',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },

  // --- African Languages ---
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    locale: 'sw-KE',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true,
    popular: true
  },
  {
    code: 'af',
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    locale: 'af-ZA',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: true,
    ocrSupport: true
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    locale: 'am-ET',
    script: 'Ethiopic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    locale: 'ha-NG',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    locale: 'yo-NG',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    locale: 'ig-NG',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'zu',
    name: 'Zulu',
    nativeName: 'isiZulu',
    locale: 'zu-ZA',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'xh',
    name: 'Xhosa',
    nativeName: 'isiXhosa',
    locale: 'xh-ZA',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'so',
    name: 'Somali',
    nativeName: 'Soomaaliga',
    locale: 'so-SO',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'mg',
    name: 'Malagasy',
    nativeName: 'Malagasy',
    locale: 'mg-MG',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'sn',
    name: 'Shona',
    nativeName: 'chiShona',
    locale: 'sn-ZW',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'st',
    name: 'Sesotho',
    nativeName: 'Sesotho',
    locale: 'st-LS',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'rw',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
    locale: 'rw-RW',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },

  // --- Other International & Regional Languages ---
  {
    code: 'la',
    name: 'Latin',
    nativeName: 'Latīna',
    locale: 'la',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'eo',
    name: 'Esperanto',
    nativeName: 'Esperanto',
    locale: 'eo',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'yi',
    name: 'Yiddish',
    nativeName: 'ייִדיש',
    locale: 'yi',
    script: 'Hebrew',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'jv',
    name: 'Javanese',
    nativeName: 'Basa Jawa',
    locale: 'jv-ID',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'su',
    name: 'Sundanese',
    nativeName: 'Basa Sunda',
    locale: 'su-ID',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'kk',
    name: 'Kazakh',
    nativeName: 'Қазақ тілі',
    locale: 'kk-KZ',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'uz',
    name: 'Uzbek',
    nativeName: 'Oʻzbekcha',
    locale: 'uz-UZ',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'tg',
    name: 'Tajik',
    nativeName: 'Тоҷикӣ',
    locale: 'tg-TJ',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ky',
    name: 'Kyrgyz',
    nativeName: 'Кыргызча',
    locale: 'ky-KG',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'ug',
    name: 'Uyghur',
    nativeName: 'ئۇيغۇرچە',
    locale: 'ug-CN',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: true
  },
  {
    code: 'tt',
    name: 'Tatar',
    nativeName: 'Татарча',
    locale: 'tt-RU',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ba',
    name: 'Bashkir',
    nativeName: 'Башҡортса',
    locale: 'ba-RU',
    script: 'Cyrillic',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'sm',
    name: 'Samoan',
    nativeName: 'Gagana Samoa',
    locale: 'sm',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'mi',
    name: 'Maori',
    nativeName: 'Te Reo Māori',
    locale: 'mi-NZ',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'haw',
    name: 'Hawaiian',
    nativeName: 'ʻŌlelo Hawaiʻi',
    locale: 'haw-US',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ht',
    name: 'Haitian Creole',
    nativeName: 'Kreyòl Ayisyen',
    locale: 'ht-HT',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ceb',
    name: 'Cebuano',
    nativeName: 'Sinugboanon',
    locale: 'ceb-PH',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'ilo',
    name: 'Ilocano',
    nativeName: 'Ilokano',
    locale: 'ilo-PH',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    locale: 'sd-PK',
    script: 'Arabic',
    direction: 'rtl',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    locale: 'mai-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'bho',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    locale: 'bho-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    locale: 'doi-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    locale: 'kok-IN',
    script: 'Devanagari',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'mni-Mtei',
    name: 'Meiteilon (Manipuri)',
    nativeName: 'মৈতৈলোন্',
    locale: 'mni-IN',
    script: 'Bengali',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  },
  {
    code: 'lus',
    name: 'Mizo',
    nativeName: 'Mizo ṭawng',
    locale: 'lus-IN',
    script: 'Latin',
    direction: 'ltr',
    translationSupport: true,
    speechSupport: false,
    ocrSupport: false
  }
];

export const LANGUAGE_MAP = new Map<string, LanguageConfig>(
  SUPPORTED_LANGUAGES.map(lang => [lang.code.toLowerCase(), lang])
);

export function getLanguage(code: string): LanguageConfig | undefined {
  if (code.toLowerCase() === 'auto') return AUTO_DETECT;
  return LANGUAGE_MAP.get(code.toLowerCase());
}

export function isRTL(code: string): boolean {
  const lang = getLanguage(code);
  return lang?.direction === 'rtl';
}
