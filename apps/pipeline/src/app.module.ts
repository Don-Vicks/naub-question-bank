import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { R2Module } from './storage/r2.module';

function getDbConfig() {
  let url = process.env.DATABASE_URL;
  if (!url) return { type: 'postgres' as const, url: undefined, synchronize: true };

  // Resolve node pg sslmode deprecation warning by converting sslmode alias
  if (url.includes('sslmode=require') && !url.includes('uselibpqcompat=true')) {
    url = url.replace('sslmode=require', 'uselibpqcompat=true&sslmode=require');
  } else if (url.includes('sslmode=prefer') && !url.includes('uselibpqcompat=true')) {
    url = url.replace('sslmode=prefer', 'uselibpqcompat=true&sslmode=require');
  } else if (url.includes('sslmode=verify-ca')) {
    url = url.replace('sslmode=verify-ca', 'sslmode=verify-full');
  }

  const isCloudDb =
    url.includes('sslmode=') ||
    url.includes('neon.tech') ||
    url.includes('supabase') ||
    process.env.NODE_ENV === 'production';

  return {
    type: 'postgres' as const,
    url,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRoot(getDbConfig()),
    AuthModule,
    AdminModule,
    R2Module,
    QuestionBankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
