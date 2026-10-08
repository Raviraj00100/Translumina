import rateLimit from 'express-rate-limit';

export const translationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 translation requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  }
});

export const ocrLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Limit OCR requests to 60 per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many OCR requests. Please try again later.'
  }
});
