import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string | null;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME ?? 'naub-question-bank';
    this.publicUrl = process.env.R2_PUBLIC_URL ?? null;
    
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ...(metadata && Object.keys(metadata).length > 0 ? { Metadata: metadata } : {}),
    }));
    this.logger.log(`Uploaded to R2: ${key}`);
    return this.getUrl(key);
  }

  async uploadFromPath(
    filePath: string,
    key: string,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    const fs = await import('fs/promises');
    const body = await fs.readFile(filePath);
    return this.uploadFile(key, body, contentType, metadata);
  }

  getUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return `r2://${this.bucketName}/${key}`;
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    }));
    this.logger.log(`Deleted from R2: ${key}`);
  }

  getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const types: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };
    return types[ext ?? ''] ?? 'application/octet-stream';
  }
}
