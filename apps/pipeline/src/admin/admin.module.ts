import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { SourceDocument } from '../question-bank/entities/source-document.entity';
import { Question } from '../question-bank/entities/question.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SourceDocument, Question])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
