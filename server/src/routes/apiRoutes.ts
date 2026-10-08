import { Router, Request, Response } from 'express';
import multer from 'multer';
import { TranslationManager } from '../providers/TranslationManager.js';
import { processImageOcr } from '../services/ocrService.js';
import { translationLimiter, ocrLimiter } from '../middleware/rateLimiter.js';
import { SUPPORTED_LANGUAGES, getLanguage } from '../config/languages.js';

const router = Router();
const translationManager = new TranslationManager();

// Setup Multer for secure in-memory file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const serverStartTime = Date.now();

// 1. Translation Endpoint
router.post('/translate', translationLimiter, async (req: Request, res: Response) => {
  try {
    const { text, from = 'auto', to } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      res.status(400).json({ success: false, error: 'Text parameter is required and cannot be empty.' });
      return;
    }

    if (!to || typeof to !== 'string') {
      res.status(400).json({ success: false, error: 'Target language (to) is required.' });
      return;
    }

    if (text.length > 25000) {
      res.status(413).json({ success: false, error: 'Text exceeds maximum allowable length of 25,000 characters.' });
      return;
    }

    // Verify target language is supported
    const targetLang = getLanguage(to);
    if (!targetLang && to !== 'auto') {
      res.status(400).json({ success: false, error: `Target language '${to}' is not recognized.` });
      return;
    }

    const result = await translationManager.translate(text, from, to);

    res.json({
      success: true,
      translatedText: result.text,
      detectedSource: result.detectedSource,
      source: from,
      target: to,
      provider: result.provider,
      chunksProcessed: result.chunksProcessed,
      characterCount: text.length
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Translation service error';
    res.status(502).json({
      success: false,
      error: `Translation could not be completed: ${errorMsg}. Please try again.`
    });
  }
});

// 2. Language Detection Endpoint
router.post('/detect', translationLimiter, async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ success: false, error: 'Text parameter is required.' });
      return;
    }

    const detection = await translationManager.detect(text);
    const langDetails = detection.language ? getLanguage(detection.language) : null;

    res.json({
      success: true,
      confident: detection.confident,
      language: detection.language,
      languageName: langDetails ? langDetails.name : detection.language,
      nativeName: langDetails ? langDetails.nativeName : '',
      score: detection.score || 0,
      message: detection.message
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Detection error';
    res.status(500).json({ success: false, error: errorMsg });
  }
});

// 3. OCR Image Recognition Endpoint
router.post('/ocr', ocrLimiter, upload.single('image'), async (req: Request, res: Response) => {
  try {
    let buffer: Buffer | null = null;
    const lang = (req.body.ocrLanguage as string) || 'eng';

    if (req.file) {
      buffer = req.file.buffer;
    } else if (req.body.base64) {
      const base64Data = req.body.base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }

    if (!buffer) {
      res.status(400).json({ success: false, error: 'An image file or base64 image data is required for OCR.' });
      return;
    }

    const ocrResult = await processImageOcr(buffer, lang);

    if (!ocrResult.success) {
      res.status(422).json({
        success: false,
        error: ocrResult.message || 'No readable text found. Try another image.'
      });
      return;
    }

    res.json({
      success: true,
      extractedText: ocrResult.extractedText,
      confidence: ocrResult.confidence
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'OCR processing error';
    res.status(500).json({ success: false, error: errorMsg });
  }
});

// 4. Languages Catalog Endpoint
router.get('/languages', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: SUPPORTED_LANGUAGES.length,
    languages: SUPPORTED_LANGUAGES
  });
});

// 5. Health Monitoring Endpoint
router.get('/health', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  const metrics = translationManager.getMetrics();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    service: 'International Translation Platform API',
    version: '1.0.0',
    providers: {
      active: metrics.activeProviders,
      totalConfigured: metrics.activeProviders.length
    },
    metrics: {
      totalRequests: metrics.totalRequests,
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      averageLatencyMs: metrics.averageLatencyMs,
      providerDistribution: metrics.providerUsage,
      lastError: metrics.lastError || null
    },
    memory: {
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024)
    }
  });
});

export default router;
