import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsOptional()
  @IsString()
  subjectHint?: string;

  @IsOptional()
  @IsString()
  courseCode?: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsOptional()
  @IsString()
  session?: string;
}

export class ReviewDecisionDto {
  @IsString()
  decision: 'approve' | 'reject' | 'edit';

  @IsOptional()
  @IsString()
  correctedTextLatex?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
