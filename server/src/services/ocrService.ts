import Tesseract from 'tesseract.js';

export interface OcrResult {
  success: boolean;
  extractedText: string;
  confidence: number;
  message?: string;
}

export async function processImageOcr(
  imageBuffer: Buffer,
  ocrLanguage = 'eng'
): Promise<OcrResult> {
  try {
    const { data } = await Tesseract.recognize(imageBuffer, ocrLanguage, {
      errorHandler: (err) => console.error('Tesseract error:', err)
    });

    const cleanedText = (data.text || '').trim();

    if (!cleanedText || cleanedText.length === 0) {
      return {
        success: false,
        extractedText: '',
        confidence: 0,
        message: 'No readable text found. Try another image.'
      };
    }

    return {
      success: true,
      extractedText: cleanedText,
      confidence: Math.round(data.confidence || 0)
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      extractedText: '',
      confidence: 0,
      message: `OCR processing failed: ${errorMsg}`
    };
  }
}
