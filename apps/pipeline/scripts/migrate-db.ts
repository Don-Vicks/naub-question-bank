import { DataSource } from 'typeorm';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load pipeline .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const OLD_DB_URL = process.env.OLD_DATABASE_URL;
const NEW_DB_URL = process.env.DATABASE_URL;

// Entities
import { User } from '../src/auth/entities/user.entity';
import { SourceDocument } from '../src/question-bank/entities/source-document.entity';
import { Question } from '../src/question-bank/entities/question.entity';

async function migrate() {
  if (!OLD_DB_URL || !NEW_DB_URL) {
    console.error('❌ Error: Both OLD_DATABASE_URL and DATABASE_URL environment variables must be defined.');
    process.exit(1);
  }

  console.log('🚀 Starting Database Migration...');
  console.log('--------------------------------------------------');
  console.log(`Source DB: ${OLD_DB_URL.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`Target DB: ${NEW_DB_URL.replace(/:[^:@]+@/, ':****@')}`);
  console.log('--------------------------------------------------\n');

  // Step 1: Initialize target DB schema with TypeORM
  console.log('1️⃣  Initializing schema on Target Database...');
  const targetDataSource = new DataSource({
    type: 'postgres',
    url: NEW_DB_URL,
    ssl: NEW_DB_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    entities: [User, SourceDocument, Question],
    synchronize: true, // Creates tables, indexes, constraints
    logging: false,
  });

  await targetDataSource.initialize();
  console.log('✅ Target schema initialized successfully!\n');

  // Step 2: Connect to Old Database
  console.log('2️⃣  Connecting to Old Database...');
  const oldPgClient = new Client({
    connectionString: OLD_DB_URL,
  });

  try {
    await oldPgClient.connect();
    console.log('✅ Connected to Old Database.\n');
  } catch (err: any) {
    console.error('❌ Failed to connect to old database:', err.message);
    await targetDataSource.destroy();
    process.exit(1);
  }

  // Step 3: Migrate Users
  console.log('3️⃣  Migrating "users"...');
  const oldUsersRes = await oldPgClient.query('SELECT * FROM users');
  const oldUsers = oldUsersRes.rows;
  console.log(`Found ${oldUsers.length} users in old DB.`);

  const userRepo = targetDataSource.getRepository(User);
  let migratedUsers = 0;
  for (const u of oldUsers) {
    await userRepo.save({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
    });
    migratedUsers++;
  }
  console.log(`✅ Migrated ${migratedUsers}/${oldUsers.length} users.\n`);

  // Step 4: Migrate Source Documents
  console.log('4️⃣  Migrating "source_documents"...');
  const oldDocsRes = await oldPgClient.query('SELECT * FROM source_documents');
  const oldDocs = oldDocsRes.rows;
  console.log(`Found ${oldDocs.length} source documents in old DB.`);

  const docRepo = targetDataSource.getRepository(SourceDocument);
  let migratedDocs = 0;
  for (const d of oldDocs) {
    await docRepo.save({
      id: d.id,
      originalFilename: d.originalFilename,
      mimeType: d.mimeType,
      storagePath: d.storagePath,
      fileUrl: d.fileUrl,
      pageCount: d.pageCount ?? 1,
      status: d.status ?? 'uploaded',
      facultyId: d.facultyId,
      departmentId: d.departmentId,
      courseCode: d.courseCode,
      level: d.level,
      examType: d.examType,
      session: d.session,
      subjectHint: d.subjectHint,
      uploaderId: d.uploaderId,
      extractedTitle: d.extractedTitle,
      extractedSubject: d.extractedSubject,
      examBoard: d.examBoard,
      examYear: d.examYear,
      metadataConfidence: d.metadataConfidence,
      errorMessage: d.errorMessage,
      createdAt: d.createdAt ? new Date(d.createdAt) : undefined,
    });
    migratedDocs++;
  }
  console.log(`✅ Migrated ${migratedDocs}/${oldDocs.length} source documents.\n`);

  // Step 5: Migrate Questions
  console.log('5️⃣  Migrating "questions"...');
  const oldQuestionsRes = await oldPgClient.query('SELECT * FROM questions');
  const oldQuestions = oldQuestionsRes.rows;
  console.log(`Found ${oldQuestions.length} questions in old DB.`);

  const questionRepo = targetDataSource.getRepository(Question);
  let migratedQuestions = 0;
  for (const q of oldQuestions) {
    await questionRepo.save({
      id: q.id,
      sourceDocument: { id: q.sourceDocumentId } as any,
      pageNumber: q.pageNumber,
      questionNumber: q.questionNumber,
      textRaw: q.textRaw,
      textLatex: q.textLatex,
      subject: q.subject,
      hasDiagram: q.hasDiagram,
      diagramAssetUrl: q.diagramAssetUrl,
      sourcePageImageUrl: q.sourcePageImageUrl,
      confidence: q.confidence,
      reviewStatus: q.reviewStatus,
      reviewNotes: q.reviewNotes,
      modelUsed: q.modelUsed,
      createdAt: q.createdAt ? new Date(q.createdAt) : undefined,
      updatedAt: q.updatedAt ? new Date(q.updatedAt) : undefined,
    });
    migratedQuestions++;
  }
  console.log(`✅ Migrated ${migratedQuestions}/${oldQuestions.length} questions.\n`);

  // Step 6: Parity & Verification Report
  console.log('6️⃣  Running Verification & Parity Check...');
  const newUsersCount = await userRepo.count();
  const newDocsCount = await docRepo.count();
  const newQuestionsCount = await questionRepo.count();

  console.log('--------------------------------------------------');
  console.log('SUMMARY REPORT:');
  console.log(`- Users:            Old = ${oldUsers.length} | New = ${newUsersCount}`);
  console.log(`- Source Documents: Old = ${oldDocs.length} | New = ${newDocsCount}`);
  console.log(`- Questions:        Old = ${oldQuestions.length} | New = ${newQuestionsCount}`);
  console.log('--------------------------------------------------');

  if (
    oldUsers.length === newUsersCount &&
    oldDocs.length === newDocsCount &&
    oldQuestions.length === newQuestionsCount
  ) {
    console.log('🎉 Migration PASSED: 100% parity verified between old and new databases!\n');
  } else {
    console.warn('⚠️  Migration completed with discrepancy in row counts. Please inspect log.\n');
  }

  await oldPgClient.end();
  await targetDataSource.destroy();
}

migrate().catch((err) => {
  console.error('💥 Fatal Migration Error:', err);
  process.exit(1);
});
