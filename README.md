# TransLumina — Premium International Translation Platform

> A production-ready, fully functional international translation application engineered with genuine multi-engine translation, real Web Speech recognition, real Text-to-Speech synthesis, camera & image OCR, and RTL bidirectional typography.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![Tests](https://img.shields.io/badge/tests-22%2F22%20passing-brightgreen.svg)

---

## 1. Project Overview

**TransLumina** is built for real-world global communication with the core flow:

$$\text{\bf WRITE / SPEAK / CAPTURE} \longrightarrow \text{\bf SELECT LANGUAGE} \longrightarrow \text{\bf TRANSLATE} \longrightarrow \text{\bf COPY / LISTEN / SHARE}$$

### Zero-Fake Guarantee
- **Real Translations**: Multi-provider translation engine (Google Translate, MyMemory fallback, Azure Translator, and DeepL).
- **Real Speech Recognition**: Hardware microphone integration using the browser Web Speech API.
- **Real Text-To-Speech**: Device audio output with language-specific locale matching and voice selection.
- **Real Camera & Image OCR**: Extract text from images, signs, screenshots, and documents via Tesseract OCR engine.
- **Real Language Auto-Detection**: Confident language detection with threshold validation (no silent guesswork on ambiguous/short inputs).

---

## 2. Core Features

1. **Multi-Provider Translation Engine**: Primary Google Translate engine with automatic fallback to MyMemory, DeepL, and Azure Cognitive Services.
2. **Auto Language Detection**: Real detection with confidence scoring. If input is too short or ambiguous, prompts user for manual selection.
3. **113+ Real Supported Languages**: Full metadata including native names, scripts, BCP 47 locales, and RTL indicators.
4. **Searchable Language Selector**: Filter by search query, popular languages, and recently used languages.
5. **Bidirectional Swap**: 1-click swapping of source and target languages and texts.
6. **Smart Long-Text Chunking**: Safe paragraph and sentence-boundary splitting for texts up to 25,000 characters without data loss.
7. **Instant Copy & Share**: Clipboard access with feedback (`Copied ✓`) and native Web Share API with automated fallback.
8. **Real Voice Input**: Live microphone listening with animated pulse state and language locale binding.
9. **Real Text-to-Speech**: Speech synthesis with voice selection and play/stop controls.
10. **Camera & Image OCR**: Live camera snapshot capture or file dropzone (PNG, JPG, WebP) with instant extraction preview and translation.
11. **RTL Language Support**: Comprehensive bidirectional layout and typography for Arabic, Urdu, Hebrew, and Persian.
12. **Full Unicode Support**: Accurate rendering and handling of emojis, diacritics, and non-Latin scripts.
13. **Modern Themes**: Seamless toggle between sleek daylight mode and deep obsidian dark mode.
14. **Production Security**: Rate limiting, Helmet headers, CORS policies, and server-side secret isolation.
15. **Health & Architecture Monitoring**: Live `/api/v1/health` endpoint and in-app system diagnostic modal.

---

## 3. Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│  (React 18 + TypeScript + Vite + Web Speech + Audio Canvas) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / Multipart
┌──────────────────────────────▼──────────────────────────────┐
│                  Production Express Server                  │
│       Rate Limiting • Request Logger • Helmet Security      │
├──────────────────────────────┬──────────────────────────────┤
│       Routing Layer          │        Core Services         │
│  • /api/v1/translate         │  • Text Chunker Engine       │
│  • /api/v1/detect            │  • OCR Image Processor       │
│  • /api/v1/ocr               │  • Translation Manager       │
│  • /api/v1/languages         │  • Health & Metrics Registry │
│  • /api/v1/health            │                              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Provider Fallback Chain
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ Google Engine │ ──▶  │   MyMemory    │ ──▶  │ DeepL / Azure │
│  (130+ langs) │      │  (Fallback)   │      │  (Enterprise) │
└───────────────┘      └───────────────┘      └───────────────┘
```

---

## 4. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Vanilla CSS Design System with Glassmorphism.
- **Backend**: Node.js 20+, Express 5, TypeScript (`tsx` runtime), Helmet, Express Rate Limit, Multer.
- **Engines**: `google-translate-api-x`, MyMemory API, DeepL API, Azure Translator, `tesseract.js`.
- **Testing**: Built-in Node.js Test Runner (`node:test`) + `node:assert`.

---

## 5. Installation & Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Step 1: Install Dependencies
```bash
# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### Step 2: Environment Setup
Copy the template configuration:
```bash
cp .env.example .env
```
*(TransLumina works out-of-the-box with built-in translation engines even without external API keys).*

---

## 6. Environment Variables

| Variable | Description | Default | Required? |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP port for server | `5050` | No |
| `NODE_ENV` | Environment mode (`development` or `production`) | `production` | No |
| `DEEPL_API_KEY` | DeepL API Key (Free or Pro) | None | Optional |
| `AZURE_TRANSLATOR_KEY` | Azure Cognitive Translator Key | None | Optional |
| `AZURE_TRANSLATOR_REGION` | Azure Translator Region | `global` | Optional |
| `GOOGLE_TRANSLATE_API_KEY` | Google Cloud Translation API Key | None | Optional |
| `MYMEMORY_EMAIL` | Custom email for MyMemory high quota | None | Optional |
| `LIBRETRANSLATE_URL` | Self-hosted LibreTranslate instance URL | None | Optional |

---

## 7. Running the Application

### Production Build & Launch (Recommended)
```bash
# Build both frontend and backend
npm run build

# Start the unified production server
npm run start
```
The application will be live at **`http://localhost:5050`**.

### Development Mode (Concurrent Hot-Reload)
```bash
npm run dev
```
- Client Vite Dev: `http://localhost:5173`
- Backend API Server: `http://localhost:5050`

---

## 8. Automated Testing

Run the full automated test suite (Unit, Integration, and End-to-End):

```bash
npm run test
```

### Test Coverage Highlights
- **Chunking Engine** (`tests/chunker.test.ts`): Paragraph preservation, sentence segmentation, unicode safety.
- **Language Database** (`tests/languages.test.ts`): 113 language records, RTL flags, schema validation.
- **Live Integration** (`tests/integration.test.ts`): Live multilingual translation, auto-detection, emoji preservation.
- **End-to-End API** (`tests/e2e.test.ts`): Live endpoint calls against the running server for `/translate`, `/detect`, `/languages`, `/health`, and `/ocr`.

---

## 9. API Reference

### 1. Translate
`POST /api/v1/translate`
```json
{
  "text": "Hello world",
  "from": "auto",
  "to": "es"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "translatedText": "Hola Mundo",
  "detectedSource": "en",
  "source": "auto",
  "target": "es",
  "provider": "Google",
  "chunksProcessed": 1,
  "characterCount": 11
}
```

### 2. Detect Language
`POST /api/v1/detect`
```json
{
  "text": "Bonjour tout le monde"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "confident": true,
  "language": "fr",
  "languageName": "French",
  "nativeName": "Français",
  "score": 0.95
}
```

### 3. OCR (Image Text Extraction)
`POST /api/v1/ocr`
- **Content-Type**: `multipart/form-data` with `image` file OR `application/json` with `{ "base64": "..." }`.
**Response (200 OK):**
```json
{
  "success": true,
  "extractedText": "EXTRACTED DOCUMENT TEXT",
  "confidence": 92
}
```

### 4. Health & Monitoring
`GET /api/v1/health`
**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-08T10:15:00.000Z",
  "uptimeSeconds": 360,
  "service": "International Translation Platform API",
  "providers": {
    "active": ["Google", "MyMemory"],
    "totalConfigured": 2
  },
  "metrics": {
    "totalRequests": 18,
    "successfulRequests": 18,
    "failedRequests": 0,
    "averageLatencyMs": 312
  }
}
```

---

## 10. Security & Privacy

1. **Zero Secret Exposure**: All API keys and secrets reside strictly in server environment variables. Never in the client bundle.
2. **Abuse & Cost Protection**: IP rate limiting via `express-rate-limit` prevents API flooding (300 translations / 15 min, 60 OCR / 15 min).
3. **Structured Privacy Logging**: Logs only contain Request IDs, endpoints, status codes, and latency. Translation text, voice recordings, and OCR images are **never written to disk or logs**.
4. **Input Sanitization**: Request bodies enforce maximum size limits (25,000 characters for translation, 10MB for OCR).

---

## 11. Deployment

### Containerized Deployment (Docker)
A production multi-stage `Dockerfile` is provided:
```bash
# Build Docker image
docker build -t translumina:latest .

# Run container
docker run -d -p 5050:5050 --name translumina translumina:latest
```

### Cloud Platforms (Render, Railway, Fly.io, AWS)
- Deploy the repository directly.
- Build command: `npm run build`
- Start command: `npm run start`
- Port: `5050`
