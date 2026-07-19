import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface NormalizedBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable()
export class DiagramCropService {
  async cropDiagram(
    pageImagePath: string,
    bbox: NormalizedBBox,
    outputDir: string,
    fileNameHint: string,
  ): Promise<string> {
    await fs.mkdir(outputDir, { recursive: true });

    const image = sharp(pageImagePath);
    const metadata = await image.metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    const margin = 0.02;
    const left = Math.max(0, Math.floor((bbox.x / 1000 - margin) * width));
    const top = Math.max(0, Math.floor((bbox.y / 1000 - margin) * height));
    const cropWidth = Math.min(
      width - left,
      Math.ceil(((bbox.width / 1000) + margin * 2) * width),
    );
    const cropHeight = Math.min(
      height - top,
      Math.ceil(((bbox.height / 1000) + margin * 2) * height),
    );

    const outPath = path.join(outputDir, `${fileNameHint}.png`);

    await sharp(pageImagePath)
      .extract({
        left,
        top,
        width: Math.max(1, cropWidth),
        height: Math.max(1, cropHeight),
      })
      .png()
      .toFile(outPath);

    return outPath;
  }
}
