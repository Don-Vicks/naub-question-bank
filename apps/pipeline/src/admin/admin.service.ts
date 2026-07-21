import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { SourceDocument } from '../question-bank/entities/source-document.entity';
import { Question } from '../question-bank/entities/question.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SourceDocument)
    private readonly docRepo: Repository<SourceDocument>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async getOverview() {
    const [totalPapers, totalQuestions, flagged, approved, rejected, totalUsers, recentPapers, recentUsers] =
      await Promise.all([
        this.docRepo.count(),
        this.questionRepo.count(),
        this.questionRepo.count({ where: { reviewStatus: 'flagged' } }),
        this.questionRepo.count({ where: { reviewStatus: 'approved' } }),
        this.questionRepo.count({ where: { reviewStatus: 'rejected' } }),
        this.userRepo.count(),
        this.docRepo.count({ where: { createdAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) } }),
        this.userRepo.count({ where: { createdAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) } }),
      ]);

    const recentDocs = await this.docRepo.find({
      order: { createdAt: 'DESC' },
      take: 10,
      select: ['id', 'originalFilename', 'extractedTitle', 'status', 'createdAt'],
    });

    return {
      stats: {
        totalPapers,
        totalQuestions,
        flaggedQuestions: flagged,
        approvedQuestions: approved,
        rejectedQuestions: rejected,
        pendingQuestions: totalQuestions - approved - rejected - flagged,
        totalUsers,
        recentPapers,
        recentUsers,
      },
      recentActivity: recentDocs.map((doc) => ({
        id: doc.id,
        action: doc.status === 'extracted' ? 'Paper processed' : doc.status === 'failed' ? 'Processing failed' : 'Paper uploaded',
        detail: doc.extractedTitle ?? doc.originalFilename,
        time: doc.createdAt.toISOString(),
      })),
    };
  }

  async getPapers(params: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const qb = this.docRepo.createQueryBuilder('doc');

    if (params.search) {
      qb.where(
        '(doc.originalFilename LIKE :s OR doc.courseCode LIKE :s OR doc.extractedTitle LIKE :s OR doc.extractedSubject LIKE :s)',
        { s: `%${params.search}%` },
      );
    }
    if (params.status) {
      qb.andWhere('doc.status = :status', { status: params.status });
    }

    const [items, total] = await qb
      .orderBy('doc.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const uploaderIds = Array.from(new Set(items.map((d) => d.uploaderId).filter(Boolean))) as string[];
    let userMap = new Map<string, { name?: string; email: string }>();
    if (uploaderIds.length > 0) {
      const users = await this.userRepo.findBy({ id: In(uploaderIds) });
      userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));
    }

    return {
      items: items.map((doc) => {
        const uploader = doc.uploaderId ? userMap.get(doc.uploaderId) : null;
        return {
          id: doc.id,
          title: doc.courseCode ? `${doc.courseCode} ${doc.originalFilename}` : doc.originalFilename,
          courseCode: doc.courseCode ?? doc.extractedSubject ?? '—',
          status: doc.status,
          pageCount: doc.pageCount ?? 1,
          uploadedAt: doc.createdAt.toISOString(),
          uploaderId: doc.uploaderId,
          uploaderName: uploader?.name ?? null,
          uploaderEmail: uploader?.email ?? 'System / Anonymous',
          fileUrl: doc.fileUrl,
          errorMessage: doc.errorMessage,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deletePaper(id: string) {
    const doc = await this.docRepo.findOneOrFail({ where: { id } });
    await this.questionRepo.delete({ sourceDocument: { id } });
    await this.docRepo.remove(doc);
    return { deleted: true };
  }

  async getUsers(params: { search?: string; page?: number; limit?: number }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const qb = this.userRepo.createQueryBuilder('user');

    if (params.search) {
      qb.where('(user.name LIKE :s OR user.email LIKE :s)', { s: `%${params.search}%` });
    }

    const [items, total] = await qb
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const userIds = items.map((u) => u.id);
    const paperCounts = await this.docRepo
      .createQueryBuilder('doc')
      .select('doc.uploaderId', 'uploaderId')
      .addSelect('COUNT(*)', 'count')
      .where('doc.uploaderId IN (:...ids)', { ids: userIds.length > 0 ? userIds : ['__none__'] })
      .groupBy('doc.uploaderId')
      .getRawMany<{ uploaderId: string; count: string }>();

    const countMap = new Map(paperCounts.map((r) => [r.uploaderId, Number(r.count)]));

    return {
      items: items.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        joinedAt: u.createdAt.toISOString(),
        papersUploaded: countMap.get(u.id) ?? 0,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async promoteUser(id: string) {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    user.role = 'admin';
    await this.userRepo.save(user);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async demoteUser(id: string) {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    user.role = 'user';
    await this.userRepo.save(user);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async getStats() {
    const [totalPapers, totalQuestions, flagged, approved, rejected, totalUsers] = await Promise.all([
      this.docRepo.count(),
      this.questionRepo.count(),
      this.questionRepo.count({ where: { reviewStatus: 'flagged' } }),
      this.questionRepo.count({ where: { reviewStatus: 'approved' } }),
      this.questionRepo.count({ where: { reviewStatus: 'rejected' } }),
      this.userRepo.count(),
    ]);

    const statusBreakdown = [
      { label: 'Approved', count: approved, color: 'verified' },
      { label: 'Flagged', count: flagged, color: 'terracotta' },
      { label: 'Rejected', count: rejected, color: 'ink' },
      { label: 'Pending', count: totalQuestions - approved - rejected - flagged, color: 'marigold' },
    ];

    const statusCounts = await this.docRepo
      .createQueryBuilder('doc')
      .select('doc.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('doc.status')
      .getRawMany<{ status: string; count: string }>();

    const subjectCounts = await this.questionRepo
      .createQueryBuilder('q')
      .select('q.subject', 'subject')
      .addSelect('COUNT(*)', 'count')
      .where('q.subject IS NOT NULL')
      .groupBy('q.subject')
      .orderBy('count', 'DESC')
      .getRawMany<{ subject: string; count: string }>();

    const extractionRate = totalQuestions > 0
      ? Math.round((approved / totalQuestions) * 1000) / 10
      : 0;

    return {
      totalPapers,
      totalQuestions,
      totalUsers,
      extractionRate,
      statusBreakdown,
      papersByStatus: statusCounts.map((r) => ({ status: r.status, count: Number(r.count) })),
      questionsBySubject: subjectCounts.map((r) => ({ subject: r.subject, count: Number(r.count) })),
    };
  }
}
