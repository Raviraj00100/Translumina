import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onTextExtracted
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedPreview, setExtractedPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setOcrError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setOcrError('Camera access unavailable or permission denied. Please use the file upload option.');
      setMode('upload');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    processOcr(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCapturedImage(result);
      processOcr(result);
    };
    reader.readAsDataURL(file);
  };

  const processOcr = async (base64Image: string) => {
    setIsProcessing(true);
    setOcrError(null);
    setExtractedPreview(null);

    try {
      const res = await fetch('/api/v1/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: base64Image, ocrLanguage: 'eng' })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No readable text found. Try another image.');
      }

      setExtractedPreview(data.extractedText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No readable text found. Try another image.';
      setOcrError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyText = () => {
    if (extractedPreview) {
      onTextExtracted(extractedPreview);
      handleClose();
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setExtractedPreview(null);
    setOcrError(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setExtractedPreview(null);
    setOcrError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Camera and OCR Translation">
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={20} color="var(--brand-primary)" />
            <h2 className="modal-title">Camera & Image Translation (OCR)</h2>
          </div>
          <button className="icon-btn" onClick={handleClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mode Switcher */}
          {!capturedImage && (
            <div className="language-tabs" style={{ marginBottom: '1.25rem' }}>
              <button
                className={`tab-btn ${mode === 'upload' ? 'active' : ''}`}
                onClick={() => setMode('upload')}
              >
                Upload / Browse Image
              </button>
              <button
                className={`tab-btn ${mode === 'camera' ? 'active' : ''}`}
                onClick={() => setMode('camera')}
              >
                Live Camera
              </button>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <img
                src={capturedImage}
                alt="Captured document for OCR"
                style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
              />

              {isProcessing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  <div className="spinner" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}></div>
                  Extracting text with OCR engine...
                </div>
              )}

              {extractedPreview && (
                <div style={{ width: '100%', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={16} /> Text Successfully Extracted:
                  </div>
                  <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', maxHeight: '140px', overflowY: 'auto' }}>
                    {extractedPreview}
                  </div>
                </div>
              )}

              {ocrError && (
                <div style={{ width: '100%', background: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} />
                  <span>{ocrError}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button
                  className="tool-btn"
                  style={{ flex: 1, padding: '0.75rem' }}
                  onClick={resetCapture}
                >
                  <RefreshCw size={16} /> Try Another Image
                </button>
                {extractedPreview && (
                  <button
                    className="translate-btn-main"
                    style={{ flex: 2, padding: '0.75rem', minWidth: 'auto' }}
                    onClick={applyText}
                  >
                    Insert & Translate Text
                  </button>
                )}
              </div>
            </div>
          ) : mode === 'camera' ? (
            /* Live Camera Feed */
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
              />
              <button
                className="translate-btn-main"
                onClick={capturePhoto}
                style={{ width: '100%' }}
              >
                <Camera size={18} /> Capture Photo for Translation
              </button>
            </div>
          ) : (
            /* Image File Dropzone */
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div
                className="upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={36} color="var(--brand-primary)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Click or drag an image here
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Supports photos, signs, documents, and screenshots (PNG, JPG, WebP)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
