import { Controller, Get, Param, Query, NotFoundException, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SourceDocument } from '../entities/source-document.entity';

/**
 * Static faculty/department definitions matching the frontend's naub-data.ts.
 * These are hardcoded since they represent the university's fixed structure.
 */
const FACULTIES = [
  { id: 'famss', name: 'Faculty of Arts, Management and Social Sciences', abbreviation: 'FAMSS' },
  { id: 'fcom', name: 'Faculty of Computing', abbreviation: 'FCOM' },
  { id: 'feng', name: 'Faculty of Engineering', abbreviation: 'FENG' },
  { id: 'fevs', name: 'Faculty of Environmental Sciences', abbreviation: 'FEVS' },
  { id: 'fnas', name: 'Faculty of Natural and Applied Sciences', abbreviation: 'FNAS' },
];

const DEPARTMENTS = [
  { id: 'accounting', name: 'Accounting', facultyId: 'famss' },
  { id: 'economics', name: 'Economics', facultyId: 'famss' },
  { id: 'management', name: 'Management', facultyId: 'famss' },
  { id: 'transport-logistics', name: 'Transport and Logistics Management', facultyId: 'famss' },
  { id: 'criminology', name: 'Criminology and Security Studies', facultyId: 'famss' },
  { id: 'geography', name: 'Geography', facultyId: 'famss' },
  { id: 'international-relations', name: 'International Relations', facultyId: 'famss' },
  { id: 'peace-conflict', name: 'Peace Studies and Conflict Resolution', facultyId: 'famss' },
  { id: 'political-science', name: 'Political Science', facultyId: 'famss' },
  { id: 'psychology', name: 'Psychology', facultyId: 'famss' },
  { id: 'sociology', name: 'Sociology', facultyId: 'famss' },
  { id: 'arabic', name: 'Arabic', facultyId: 'famss' },
  { id: 'english', name: 'English', facultyId: 'famss' },
  { id: 'military-history', name: 'Military History', facultyId: 'famss' },
  { id: 'computer-science', name: 'Computer Science', facultyId: 'fcom' },
  { id: 'cyber-security', name: 'Cyber Security', facultyId: 'fcom' },
  { id: 'information-system', name: 'Information System', facultyId: 'fcom' },
  { id: 'information-technology', name: 'Information Technology', facultyId: 'fcom' },
  { id: 'software-engineering', name: 'Software Engineering', facultyId: 'fcom' },
  { id: 'civil-engineering', name: 'Civil Engineering', facultyId: 'feng' },
  { id: 'electrical-electronic', name: 'Electrical and Electronic Engineering', facultyId: 'feng' },
  { id: 'mechanical-engineering', name: 'Mechanical Engineering', facultyId: 'feng' },
  { id: 'building', name: 'Building', facultyId: 'fevs' },
  { id: 'environmental-management', name: 'Environmental Management', facultyId: 'fevs' },
  { id: 'estate-management', name: 'Estate Management', facultyId: 'fevs' },
  { id: 'survey-geoinformatics', name: 'Survey and Geo-Informatics', facultyId: 'fevs' },
  { id: 'urban-regional-planning', name: 'Urban and Regional Planning', facultyId: 'fevs' },
  { id: 'biology', name: 'Biology', facultyId: 'fnas' },
  { id: 'chemistry', name: 'Chemistry', facultyId: 'fnas' },
  { id: 'mathematics', name: 'Mathematics', facultyId: 'fnas' },
  { id: 'physics', name: 'Physics', facultyId: 'fnas' },
];

/**
 * Public read-only endpoints that power the browse / paper-detail flow.
 * No auth guard — all uploaded papers are publicly viewable.
 */
@Controller('question-bank')
export class PapersController {
  constructor(
    @InjectRepository(SourceDocument)
    private readonly sourceDocRepo: Repository<SourceDocument>,
  ) {}

  /**
   * GET /question-bank/faculties
   * Returns faculties with paper counts per faculty.
   */
  @Get('faculties')
  async getFaculties() {
    const counts = await this.sourceDocRepo
      .createQueryBuilder('doc')
      .select('LOWER(doc.facultyId)', 'facultyId')
      .addSelect('COUNT(doc.id)', 'paperCount')
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] })
      .andWhere('doc.facultyId IS NOT NULL')
      .groupBy('LOWER(doc.facultyId)')
      .getRawMany();

    const countMap = new Map(counts.map((c) => [c.facultyId, Number(c.paperCount)]));

    return FACULTIES.map((f) => ({
      ...f,
      paperCount: countMap.get(f.id.toLowerCase()) ?? 0,
    }));
  }

  @Get('faculties/:facultyId/departments')
  async getDepartments(@Param('facultyId') facultyId: string) {
    const faculty = FACULTIES.find((f) => f.id.toLowerCase() === facultyId.toLowerCase());
    if (!faculty) throw new NotFoundException('Faculty not found');

    const counts = await this.sourceDocRepo
      .createQueryBuilder('doc')
      .select('LOWER(doc.departmentId)', 'departmentId')
      .addSelect('COUNT(doc.id)', 'paperCount')
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] })
      .andWhere('LOWER(doc.facultyId) = LOWER(:facultyId)', { facultyId })
      .andWhere('doc.departmentId IS NOT NULL')
      .groupBy('LOWER(doc.departmentId)')
      .getRawMany();

    const countMap = new Map(counts.map((c) => [c.departmentId, Number(c.paperCount)]));

    return DEPARTMENTS
      .filter((d) => d.facultyId.toLowerCase() === facultyId.toLowerCase())
      .map((d) => ({
        ...d,
        paperCount: countMap.get(d.id.toLowerCase()) ?? 0,
      }));
  }

  @Get('courses')
  async getCourses(
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('level') level?: string,
  ) {
    const qb = this.sourceDocRepo
      .createQueryBuilder('doc')
      .select([
        'doc.courseCode AS "code"',
        'doc.facultyId AS "facultyId"',
        'doc.departmentId AS "departmentId"',
        'doc.level AS "level"',
        'COUNT(doc.id) AS "questionPaperCount"',
      ])
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] })
      .andWhere('doc.courseCode IS NOT NULL');

    if (facultyId) qb.andWhere('LOWER(doc.facultyId) = LOWER(:facultyId)', { facultyId });
    if (departmentId) qb.andWhere('LOWER(doc.departmentId) = LOWER(:departmentId)', { departmentId });
    if (level) qb.andWhere('LOWER(doc.level) = LOWER(:level)', { level });

    const rows = await qb
      .groupBy('doc.courseCode, doc.facultyId, doc.departmentId, doc.level')
      .orderBy('doc.courseCode', 'ASC')
      .getRawMany();

    return rows.map((r) => ({
      id: `${r.departmentId ?? 'unknown'}::${r.code}`,
      code: r.code,
      title: r.code,
      department: r.departmentId ?? '',
      departmentId: r.departmentId ?? '',
      facultyId: r.facultyId ?? '',
      level: r.level ?? '',
      questionPaperCount: Number(r.questionPaperCount),
    }));
  }

  @Get('courses/:courseId')
  async getCourse(@Param('courseId') courseId: string) {
    const cleanId = decodeURIComponent(courseId).replace(/\+/g, ' ');
    let departmentId: string | undefined;
    let courseCode = cleanId;
    const separator = cleanId.indexOf('::');
    if (separator !== -1) {
      departmentId = cleanId.substring(0, separator);
      courseCode = cleanId.substring(separator + 2);
    }

    const qb = this.sourceDocRepo
      .createQueryBuilder('doc')
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] })
      .andWhere("LOWER(REPLACE(REPLACE(doc.courseCode, ' ', ''), '+', '')) = LOWER(REPLACE(REPLACE(:courseCode, ' ', ''), '+', ''))", { courseCode });

    if (departmentId) {
      qb.andWhere('LOWER(doc.departmentId) = LOWER(:departmentId)', { departmentId });
    }

    const doc = await qb.getOne();
    if (!doc) throw new NotFoundException('Course not found');

    const totalCount = await qb.getCount();

    return {
      id: courseId,
      code: doc.courseCode ?? courseCode,
      title: doc.courseCode ?? courseCode,
      department: doc.departmentId ?? '',
      departmentId: doc.departmentId ?? '',
      facultyId: doc.facultyId ?? '',
      level: doc.level ?? '',
      questionPaperCount: totalCount,
    };
  }

  @Get('papers')
  async getPapers(
    @Query('courseId') courseId?: string,
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('level') level?: string,
  ) {
    const qb = this.sourceDocRepo
      .createQueryBuilder('doc')
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] });

    if (courseId) {
      const cleanId = decodeURIComponent(courseId).replace(/\+/g, ' ');
      const separator = cleanId.indexOf('::');
      let targetCode = cleanId;
      if (separator !== -1) {
        const dept = cleanId.substring(0, separator);
        targetCode = cleanId.substring(separator + 2);
        qb.andWhere('LOWER(doc.departmentId) = LOWER(:dept)', { dept });
      }
      qb.andWhere("LOWER(REPLACE(REPLACE(doc.courseCode, ' ', ''), '+', '')) = LOWER(REPLACE(REPLACE(:targetCode, ' ', ''), '+', ''))", { targetCode });
    }

    if (facultyId) qb.andWhere('LOWER(doc.facultyId) = LOWER(:facultyId)', { facultyId });
    if (departmentId) qb.andWhere('LOWER(doc.departmentId) = LOWER(:departmentId)', { departmentId });
    if (level) qb.andWhere('LOWER(doc.level) = LOWER(:level)', { level });

    const docs = await qb.orderBy('doc.createdAt', 'DESC').getMany();
    return docs.map((doc) => this.toQuestionPaper(doc));
  }

  @Get('papers/:id')
  async getPaper(@Param('id') id: string) {
    const doc = await this.sourceDocRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Paper not found');
    return this.toQuestionPaper(doc);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      throw new NotFoundException('Search query must be at least 2 characters');
    }

    const term = `%${query.trim().toLowerCase()}%`;

    const docs = await this.sourceDocRepo
      .createQueryBuilder('doc')
      .where('doc.status IN (:...statuses)', { statuses: ['ready', 'extracted'] })
      .andWhere(
        `(LOWER(doc.courseCode) LIKE :term
          OR LOWER(doc.originalFilename) LIKE :term
          OR LOWER(doc.subjectHint) LIKE :term
          OR LOWER(doc.extractedTitle) LIKE :term
          OR LOWER(doc.extractedSubject) LIKE :term)`,
        { term },
      )
      .orderBy('doc.createdAt', 'DESC')
      .take(50)
      .getMany();

    return docs.map((doc) => this.toQuestionPaper(doc));
  }

  @Get('papers/:id/download')
  async downloadPaper(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.sourceDocRepo.findOne({ where: { id } });
    if (!doc || !doc.fileUrl) {
      throw new NotFoundException('Paper file not found');
    }

    const ext = doc.mimeType === 'application/pdf' ? '.pdf' : '.png';
    const parts = [
      doc.courseCode,
      doc.examType,
      doc.session,
      doc.originalFilename ? doc.originalFilename.replace(/\.[^/.]+$/, '') : '',
    ].filter(Boolean);
    const rawName = parts.length > 0 ? parts.join('_') : 'paper';
    const cleanFilename = `${rawName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')}${ext}`;

    try {
      const response = await fetch(doc.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.send(buffer);
    } catch {
      res.redirect(doc.fileUrl);
    }
  }

  // ── helpers ──

  private toQuestionPaper(doc: SourceDocument) {
    const isImage = doc.mimeType?.startsWith('image/') ?? false;
    const cleanFilename = doc.originalFilename ? doc.originalFilename.replace(/\.[^/.]+$/, '') : 'Question Paper';

    const pageImages = doc.pageImageUrls && doc.pageImageUrls.length > 0
      ? doc.pageImageUrls
      : (isImage && doc.fileUrl ? [doc.fileUrl] : []);

    return {
      id: doc.id,
      title: doc.courseCode
        ? `${doc.courseCode} — ${doc.examType ?? 'Paper'} ${doc.session ?? ''}`.trim()
        : `${cleanFilename} (${doc.examType ?? 'Paper'} ${doc.session ?? ''})`.trim(),
      courseCode: doc.courseCode ?? doc.subjectHint ?? 'GENERAL',
      courseId: doc.departmentId
        ? `${doc.departmentId}::${doc.courseCode ?? 'GENERAL'}`
        : doc.courseCode ?? 'GENERAL',
      facultyId: doc.facultyId ?? '',
      departmentId: doc.departmentId ?? '',
      level: doc.level ?? '',
      examType: doc.examType ?? '',
      session: doc.session ?? '',
      pageCount: doc.pageCount ?? (pageImages.length > 0 ? pageImages.length : 1),
      status: doc.status,
      mimeType: doc.mimeType,
      fileUrl: doc.fileUrl ?? null,
      thumbnailUrl: pageImages[0] ?? (isImage ? (doc.fileUrl ?? null) : null),
      pageImageUrls: pageImages,
      uploadedAt: doc.createdAt.toISOString(),
    };
  }
}
