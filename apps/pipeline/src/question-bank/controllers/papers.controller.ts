import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
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
      .select('doc.facultyId', 'facultyId')
      .addSelect('COUNT(doc.id)', 'paperCount')
      .where('doc.status = :status', { status: 'ready' })
      .andWhere('doc.facultyId IS NOT NULL')
      .groupBy('doc.facultyId')
      .getRawMany();

    const countMap = new Map(counts.map((c) => [c.facultyId, Number(c.paperCount)]));

    return FACULTIES.map((f) => ({
      ...f,
      paperCount: countMap.get(f.id) ?? 0,
    }));
  }

  /**
   * GET /question-bank/faculties/:facultyId/departments
   * Returns departments for a faculty with paper counts.
   */
  @Get('faculties/:facultyId/departments')
  async getDepartments(@Param('facultyId') facultyId: string) {
    const faculty = FACULTIES.find((f) => f.id === facultyId);
    if (!faculty) throw new NotFoundException('Faculty not found');

    const counts = await this.sourceDocRepo
      .createQueryBuilder('doc')
      .select('doc.departmentId', 'departmentId')
      .addSelect('COUNT(doc.id)', 'paperCount')
      .where('doc.status = :status', { status: 'ready' })
      .andWhere('doc.facultyId = :facultyId', { facultyId })
      .andWhere('doc.departmentId IS NOT NULL')
      .groupBy('doc.departmentId')
      .getRawMany();

    const countMap = new Map(counts.map((c) => [c.departmentId, Number(c.paperCount)]));

    return DEPARTMENTS
      .filter((d) => d.facultyId === facultyId)
      .map((d) => ({
        ...d,
        paperCount: countMap.get(d.id) ?? 0,
      }));
  }

  /**
   * GET /question-bank/courses
   * Returns distinct courses (aggregated from uploaded papers) so the
   * department → course browse page can list what's actually available.
   *
   * Query params: facultyId?, departmentId?, level?
   */
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
      .where('doc.status = :status', { status: 'ready' })
      .andWhere('doc.courseCode IS NOT NULL');

    if (facultyId) qb.andWhere('doc.facultyId = :facultyId', { facultyId });
    if (departmentId) qb.andWhere('doc.departmentId = :departmentId', { departmentId });
    if (level) qb.andWhere('doc.level = :level', { level });

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

  /**
   * GET /question-bank/courses/:courseId
   * Returns info about a single course derived from uploaded papers.
   * courseId format: "{departmentId}::{courseCode}"
   */
  @Get('courses/:courseId')
  async getCourse(@Param('courseId') courseId: string) {
    let departmentId: string | undefined;
    let courseCode = courseId;
    const separator = courseId.indexOf('::');
    if (separator !== -1) {
      departmentId = courseId.substring(0, separator);
      courseCode = courseId.substring(separator + 2);
    }

    const where: any = { courseCode, status: 'ready' };
    if (departmentId) where.departmentId = departmentId;

    const doc = await this.sourceDocRepo.findOne({ where });
    if (!doc) throw new NotFoundException('Course not found');

    return {
      id: courseId,
      code: courseCode,
      title: courseCode,
      department: doc.departmentId ?? '',
      departmentId: doc.departmentId ?? '',
      facultyId: doc.facultyId ?? '',
      level: doc.level ?? '',
      questionPaperCount: await this.sourceDocRepo.count({ where }),
    };
  }

  /**
   * GET /question-bank/papers
   * Lists uploaded papers (status = 'ready') with optional filters.
   *
   * Query params: courseId?, facultyId?, departmentId?, level?
   */
  @Get('papers')
  async getPapers(
    @Query('courseId') courseId?: string,
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
    @Query('level') level?: string,
  ) {
    const where: any = { status: 'ready' };

    if (courseId) {
      const separator = courseId.indexOf('::');
      if (separator !== -1) {
        where.departmentId = courseId.substring(0, separator);
        where.courseCode = courseId.substring(separator + 2);
      } else {
        where.courseCode = courseId;
      }
    }

    if (facultyId) where.facultyId = facultyId;
    if (departmentId) where.departmentId = departmentId;
    if (level) where.level = level;

    const docs = await this.sourceDocRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return docs.map((doc) => this.toQuestionPaper(doc));
  }

  /**
   * GET /question-bank/papers/:id
   * Single paper detail.
   */
  @Get('papers/:id')
  async getPaper(@Param('id') id: string) {
    const doc = await this.sourceDocRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Paper not found');
    return this.toQuestionPaper(doc);
  }

  /**
   * GET /question-bank/search?q=...
   * Full-text search across papers by course code, filename, subject.
   */
  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      throw new NotFoundException('Search query must be at least 2 characters');
    }

    const term = `%${query.trim().toLowerCase()}%`;

    const docs = await this.sourceDocRepo
      .createQueryBuilder('doc')
      .where('doc.status = :status', { status: 'ready' })
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

  // ── helpers ──

  private toQuestionPaper(doc: SourceDocument) {
    const isImage = doc.mimeType?.startsWith('image/') ?? false;
    return {
      id: doc.id,
      title: doc.courseCode
        ? `${doc.courseCode} — ${doc.examType ?? 'Paper'} ${doc.session ?? ''}`.trim()
        : doc.originalFilename,
      courseCode: doc.courseCode ?? doc.subjectHint ?? '',
      courseId: doc.departmentId
        ? `${doc.departmentId}::${doc.courseCode}`
        : doc.courseCode ?? '',
      facultyId: doc.facultyId ?? '',
      departmentId: doc.departmentId ?? '',
      level: doc.level ?? '',
      examType: doc.examType ?? '',
      session: doc.session ?? '',
      pageCount: doc.pageCount ?? 1,
      status: doc.status,
      mimeType: doc.mimeType,
      fileUrl: doc.fileUrl ?? null,
      thumbnailUrl: isImage ? (doc.fileUrl ?? null) : null,
      pageImageUrls: isImage && doc.fileUrl ? [doc.fileUrl] : [],
      uploadedAt: doc.createdAt.toISOString(),
    };
  }
}
