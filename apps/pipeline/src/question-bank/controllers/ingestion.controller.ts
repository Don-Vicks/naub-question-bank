import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { randomUUID as uuid } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { SourceDocument } from '../entities/source-document.entity';
import { UploadDocumentDto } from '../dto/create-question.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { R2Service } from '../../storage/r2.service';

const getUploadDir = (): string => {
  const dir = process.env.UPLOAD_DIR ?? path.join(os.tmpdir(), 'uploads', 'raw');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

@Controller('question-bank/documents')
export class IngestionController {
  constructor(
    @InjectRepository(SourceDocument)
    private readonly sourceDocRepo: Repository<SourceDocument>,
    private readonly r2Service: R2Service,
  ) {}

  /**
   * Batch upload endpoint — accepts one or more files, stores them in R2 and
   * marks each SourceDocument as 'ready' immediately. No AI extraction queue.
   *
   * Expects multipart/form-data with:
   *   - files:        one or more image / PDF files
   *   - courseCode:   e.g. "SWE218"
   *   - facultyId:    e.g. "sci-tech"
   *   - departmentId: e.g. "software-engineering"
   *   - level:        e.g. "200L"
   *   - examType:     e.g. "End of Semester"
   *   - session:      e.g. "2023/2024"
   */
  @Post('upload-batch')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 500, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          try {
            cb(null, getUploadDir());
          } catch (err: any) {
            cb(err, '');
          }
        },
        filename: (_req, file, cb) => {
          cb(null, `${uuid()}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadDocumentDto,
    @Req() req: any,
  ) {
    const results = await Promise.allSettled(
      files.map(async (file) => {
        // Determine R2 key — use a clean extension from the MIME type when
        // the browser sends a processed WebP blob with a generic name.
        const ext = this.mimeToExt(file.mimetype) ?? path.extname(file.originalname) ?? '';
        const tempDocId = uuid();
        const r2Key = `papers/${tempDocId}/original${ext}`;

        // Build S3/R2 object metadata from the upload form inputs.
        // Keys are lowercase strings; values must be strings (R2 requirement).
        // These travel with the object and are readable via a HEAD request.
        const objectMetadata: Record<string, string> = {
          'original-filename': file.originalname,
          'uploaded-by': req.user.id ?? 'unknown',
        };
        if (dto.courseCode)   objectMetadata['course-code']   = dto.courseCode.toUpperCase();
        if (dto.facultyId)    objectMetadata['faculty-id']    = dto.facultyId;
        if (dto.departmentId) objectMetadata['department-id'] = dto.departmentId;
        if (dto.level)        objectMetadata['level']         = dto.level;
        if (dto.examType)     objectMetadata['exam-type']     = dto.examType;
        if (dto.session)      objectMetadata['session']       = dto.session;

        let fileUrl: string;
        if (file.mimetype.startsWith('image/')) {
          const watermarkedBuffer = await this.watermarkImage(file.path, 'naubpadi.com.ng');
          // Overwrite local file with watermarked buffer for consistency
          fs.writeFileSync(file.path, watermarkedBuffer);
          fileUrl = await this.r2Service.uploadFile(
            r2Key,
            watermarkedBuffer,
            file.mimetype,
            objectMetadata,
          );
        } else {
          fileUrl = await this.r2Service.uploadFromPath(
            file.path,
            r2Key,
            file.mimetype,
            objectMetadata,
          );
        }

        const doc = await this.sourceDocRepo.save(
          this.sourceDocRepo.create({
            id: tempDocId,
            originalFilename: file.originalname,
            mimeType: file.mimetype,
            storagePath: file.path,   // local tmp path kept for debugging
            fileUrl,
            pageCount: 1,
            status: req.user?.role === 'admin' ? 'ready' : 'pending_review',
            courseCode: dto.courseCode ?? dto.subjectHint ?? null,
            subjectHint: dto.subjectHint ?? dto.courseCode ?? null,
            facultyId: dto.facultyId ?? null,
            departmentId: dto.departmentId ?? null,
            level: dto.level ?? null,
            examType: dto.examType ?? null,
            session: dto.session ?? null,
            uploaderId: req.user.id,
          }),
        );

        return { filename: file.originalname, documentId: doc.id, fileUrl, status: doc.status };
      }),
    );

    const succeeded = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value);
    const failed = results
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => r.status === 'rejected')
      .map(({ r, i }) => ({
        filename: files[i].originalname,
        reason: (r as PromiseRejectedResult).reason?.message ?? 'unknown',
      }));

    return {
      queued: succeeded.length,
      failed: failed.length,
      documents: succeeded,
      failedFilenames: failed.map((f) => f.filename),
      errors: failed,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async getPendingDocuments() {
    const docs = await this.sourceDocRepo.find({
      where: [{ status: 'pending_review' }, { status: 'uploaded' }],
      order: { createdAt: 'DESC' },
    });
    return docs.map((doc) => ({
      id: doc.id,
      title: doc.courseCode
        ? `${doc.courseCode} — ${doc.examType ?? 'Paper'} ${doc.session ?? ''}`.trim()
        : doc.originalFilename,
      originalFilename: doc.originalFilename,
      mimeType: doc.mimeType,
      fileUrl: doc.fileUrl,
      courseCode: doc.courseCode ?? '',
      facultyId: doc.facultyId ?? '',
      departmentId: doc.departmentId ?? '',
      level: doc.level ?? '',
      examType: doc.examType ?? '',
      session: doc.session ?? '',
      status: doc.status,
      uploaderId: doc.uploaderId,
      uploadedAt: doc.createdAt.toISOString(),
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approveDocument(@Param('id') id: string) {
    const doc = await this.sourceDocRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    doc.status = 'ready';
    return this.sourceDocRepo.save(doc);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reject')
  async rejectDocument(@Param('id') id: string) {
    const doc = await this.sourceDocRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    doc.status = 'failed';
    return this.sourceDocRepo.save(doc);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    const doc = await this.sourceDocRepo.findOneOrFail({ where: { id } });
    return {
      id: doc.id,
      status: doc.status,
      pageCount: doc.pageCount,
      errorMessage: doc.errorMessage,
      fileUrl: doc.fileUrl,
      courseCode: doc.courseCode,
      examType: doc.examType,
      session: doc.session,
    };
  }

  // ── helpers ──

  private async watermarkImage(filePath: string, text = 'naubpadi.com.ng'): Promise<Buffer> {
    try {
      const sharp = (await import('sharp')).default;
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const width = metadata.width ?? 1000;
      const height = metadata.height ?? 1400;

      const svgOverlay = Buffer.from(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .wm-text {
              font-family: Arial, sans-serif;
              font-size: ${Math.max(22, Math.floor(width / 22))}px;
              font-weight: 800;
              fill: rgba(0, 0, 0, 0.16);
              letter-spacing: 4px;
            }
            .badge-bg {
              fill: rgba(15, 23, 42, 0.88);
              rx: 8px;
            }
            .badge-text {
              font-family: Arial, sans-serif;
              font-size: ${Math.max(12, Math.floor(width / 48))}px;
              font-weight: bold;
              fill: #ffffff;
              letter-spacing: 1.5px;
            }
          </style>
          <g transform="rotate(-25, ${width / 2}, ${height / 2})">
            ${Array.from({ length: 8 })
              .map((_, r) => {
                const y = (height / 6) * r - height * 0.2;
                return Array.from({ length: 4 })
                  .map((_, c) => {
                    const x = (width / 3) * c - width * 0.2;
                    return `<text x="${x}" y="${y}" class="wm-text">${text.toUpperCase()}</text>`;
                  })
                  .join('');
              })
              .join('')}
          </g>
          <rect x="${width - Math.max(190, Math.floor(width / 3.5))}" y="${height - 42}" width="${Math.max(180, Math.floor(width / 3.5))}" height="32" class="badge-bg" />
          <text x="${width - Math.max(180, Math.floor(width / 3.5)) + 12}" y="${height - 21}" class="badge-text">NAUB PADI | ${text}</text>
        </svg>
      `);

      return await image
        .composite([{ input: svgOverlay, top: 0, left: 0 }])
        .toBuffer();
    } catch {
      const fsPromises = await import('fs/promises');
      return fsPromises.readFile(filePath);
    }
  }

  private mimeToExt(mime: string): string {
    const map: Record<string, string> = {
      'image/webp': '.webp',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'application/pdf': '.pdf',
    };
    return map[mime] ?? '';
  }
}
