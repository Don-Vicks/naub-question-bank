import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { ReviewDecisionDto } from '../dto/create-question.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('question-bank/review')
export class ReviewController {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  @Get('queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getReviewQueue(
    @Query('limit') limit = '50',
    @Query('subject') subject?: string,
  ) {
    return this.questionRepo.find({
      where: {
        reviewStatus: 'flagged',
        ...(subject ? { subject } : {}),
      },
      order: { confidence: 'ASC' },
      take: Number(limit),
      relations: ['sourceDocument'],
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStats() {
    const [total, flagged, approved, rejected] = await Promise.all([
      this.questionRepo.count(),
      this.questionRepo.count({ where: { reviewStatus: 'flagged' } }),
      this.questionRepo.count({ where: { reviewStatus: 'approved' } }),
      this.questionRepo.count({ where: { reviewStatus: 'rejected' } }),
    ]);
    return { total, flagged, approved, rejected };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async reviewDecision(
    @Param('id') id: string,
    @Body() dto: ReviewDecisionDto,
  ) {
    const question = await this.questionRepo.findOneOrFail({ where: { id } });

    if (dto.decision === 'approve') {
      question.reviewStatus = 'approved';
    } else if (dto.decision === 'reject') {
      question.reviewStatus = 'rejected';
    } else if (dto.decision === 'edit') {
      question.textLatex = dto.correctedTextLatex ?? question.textLatex;
      question.reviewStatus = 'approved';
    }

    if (dto.notes) {
      question.reviewNotes = dto.notes;
    }

    return this.questionRepo.save(question);
  }
}
