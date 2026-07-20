'use client';

import { useState, useCallback } from 'react';

interface ScanEffectOptions {
  grayscale?: boolean;
  contrast?: number;
  sharpen?: boolean;
  brightness?: number;
}

interface ScanEffectResult {
  processedUrl: string | null;
  isProcessing: boolean;
  processImage: (file: File, options?: ScanEffectOptions) => Promise<string>;
  reset: () => void;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function applyGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
}

function applyContrast(data: Uint8ClampedArray, factor: number): void {
  const intercept = 128 * (1 - factor);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * factor + intercept, 0, 255);
    data[i + 1] = clamp(data[i + 1] * factor + intercept, 0, 255);
    data[i + 2] = clamp(data[i + 2] * factor + intercept, 0, 255);
  }
}

function applyBrightness(data: Uint8ClampedArray, amount: number): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + amount, 0, 255);
    data[i + 1] = clamp(data[i + 1] + amount, 0, 255);
    data[i + 2] = clamp(data[i + 2] + amount, 0, 255);
  }
}

function applySharpen(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  const copy = new Uint8ClampedArray(data);
  const kernel = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0,
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[(y * width + x) * 4 + c] = clamp(sum, 0, 255);
      }
    }
  }
}

function autoThreshold(data: Uint8ClampedArray): number {
  const histogram = new Array(256).fill(0);
  const total = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    histogram[gray]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let maxVariance = 0;
  let threshold = 128;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

function binarize(data: Uint8ClampedArray, threshold: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const val = data[i] > threshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
}

function drawCanvasWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text = 'naubpadi.com.ng'
): void {
  ctx.save();
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.font = `800 ${Math.max(18, Math.floor(width / 24))}px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';

  const rows = 8;
  const cols = 4;
  for (let r = 0; r < rows; r++) {
    const y = (height / 5) * r - height * 0.3;
    for (let c = 0; c < cols; c++) {
      const x = (width / 2.5) * c - width * 0.3;
      ctx.fillText(text.toUpperCase(), x, y);
    }
  }
  ctx.restore();

  // Corner stamp badge
  ctx.save();
  const badgeWidth = Math.max(180, Math.floor(width / 3.5));
  const badgeHeight = Math.max(30, Math.floor(height / 35));
  const x = width - badgeWidth - 12;
  const y = height - badgeHeight - 12;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, badgeWidth, badgeHeight, 8);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, badgeWidth, badgeHeight);
  }

  ctx.font = `bold ${Math.max(11, Math.floor(width / 48))}px Arial, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`NAUB PADI | ${text}`, x + badgeWidth / 2, y + badgeHeight / 2);
  ctx.restore();
}

export function useScanEffect(): ScanEffectResult {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback(
    async (file: File, options?: ScanEffectOptions): Promise<string> => {
      setIsProcessing(true);

      const opts: Required<ScanEffectOptions> = {
        grayscale: options?.grayscale ?? true,
        contrast: options?.contrast ?? 1.8,
        sharpen: options?.sharpen ?? true,
        brightness: options?.brightness ?? 10,
      };

      try {
        const objectUrl = URL.createObjectURL(file);
        const img = await loadImage(objectUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(objectUrl);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        if (opts.grayscale) applyGrayscale(data);
        if (opts.brightness !== 0) applyBrightness(data, opts.brightness);
        if (opts.contrast !== 1) applyContrast(data, opts.contrast);
        if (opts.sharpen) applySharpen(data, canvas.width, canvas.height);

        ctx.putImageData(imageData, 0, 0);

        const threshold = autoThreshold(data);
        binarize(data, threshold);
        ctx.putImageData(imageData, 0, 0);

        // Apply permanent watermark on canvas before export
        drawCanvasWatermark(ctx, canvas.width, canvas.height, 'naubpadi.com.ng');

        const resultUrl = canvas.toDataURL('image/webp', 0.82);
        setProcessedUrl(resultUrl);
        return resultUrl;
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setProcessedUrl(null);
  }, []);

  return { processedUrl, isProcessing, processImage, reset };
}

/**
 * Converts a canvas data URL (e.g. from processImage) back into a File
 * so it can be appended to a FormData for upload.
 *
 * @param dataUrl  The data URL string (image/webp or image/jpeg)
 * @param name     Desired filename (without extension — .webp is appended)
 */
export async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const safeName = name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], safeName, { type: blob.type });
}
