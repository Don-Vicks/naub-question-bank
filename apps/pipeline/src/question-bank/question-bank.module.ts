import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { SourceDocument } from './entities/source-document.entity';

import { IngestionController } from './controllers/ingestion.controller';
import { PapersController } from './controllers/papers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceDocument]),
    forwardRef(() => AuthModule),
  ],
  controllers: [IngestionController, PapersController],
})
export class QuestionBankModule {}
