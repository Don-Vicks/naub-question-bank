'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Upload as UploadIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import { useScanEffect } from '@/lib/hooks/useScanEffect';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { api, type UploadResult } from '@/lib/api';
import {
  FACULTIES,
  LEVELS,
  EXAM_TYPES,
  ACADEMIC_SESSIONS,
  getDepartmentsByFaculty,
} from '@/lib/naub-data';

function UploadForm() {
  const router = useRouter();
  const { processImage } = useScanEffect();

  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [examType, setExamType] = useState('');
  const [session, setSession] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const departments = facultyId ? getDepartmentsByFaculty(facultyId) : [];
  const isFormValid =
    facultyId && departmentId && level && courseCode && examType && session && files.length > 0;

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
  }, []);

  const handleUpload = async () => {
    if (!isFormValid) {
      setError('Please fill in all fields and select files to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      // Pass all form metadata — backend saves these on each SourceDocument
      formData.append('courseCode', courseCode.toUpperCase());
      formData.append('subjectHint', courseCode.toUpperCase()); // backward compat
      formData.append('facultyId', facultyId);
      formData.append('departmentId', departmentId);
      formData.append('level', level);
      formData.append('examType', examType);
      formData.append('session', session);

      const uploadResult = await api.uploadPaper(formData);
      setResult(uploadResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFiles([]);
    setFacultyId('');
    setDepartmentId('');
    setLevel('');
    setCourseCode('');
    setExamType('');
    setSession('');
    setError(null);
  };

  // ── Result screen ──
  if (result) {
    const firstDoc = result.documents?.[0];
    const browsePath = departmentId && courseCode
      ? `/browse/${facultyId}/${departmentId}/${departmentId}-${courseCode.toUpperCase()}`
      : '/browse';

    return (
      <div className="page-desktop">
        <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
          <div>
            <p className="page-header-title">Upload</p>
          </div>
        </div>
        <div className="content-area">
          <div className="flex flex-col items-center gap-5 py-12 text-center animate-fade-in-up">
            {result.failed > 0 && result.queued === 0 ? (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-terracotta-50 border border-terracotta-100 transition-transform duration-300 hover:scale-110">
                  <AlertTriangle size={36} strokeWidth={2.5} className="text-terracotta" />
                </div>
                <div>
                  <p className="text-title text-ink">Upload failed</p>
                  <p className="text-body text-muted mt-1.5">
                    All {result.failed} file{result.failed !== 1 ? 's' : ''} failed to upload.
                    Please try again.
                  </p>
                </div>
                <button onClick={resetForm} className="btn-primary">
                  Try again
                </button>
              </>
            ) : (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-naub-green-light border border-naub-green/15 transition-transform duration-300 hover:scale-110">
                  <Check size={36} strokeWidth={2.5} className="text-naub-green" />
                </div>
                <div>
                  <p className="text-title text-ink">Upload successful!</p>
                  <p className="text-body text-muted mt-1.5">
                    {result.queued} file{result.queued !== 1 ? 's are' : ' is'} now live and
                    visible to all students.
                    {result.failed > 0 && ` ${result.failed} file${result.failed !== 1 ? 's' : ''} failed.`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetForm} className="btn-secondary">
                    Upload more
                  </button>
                  {firstDoc ? (
                    <button
                      onClick={() => router.push(`/paper/${firstDoc.documentId}`)}
                      className="btn-primary flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} strokeWidth={2} />
                      View paper
                    </button>
                  ) : (
                    <button onClick={() => router.push(browsePath)} className="btn-primary">
                      Browse papers
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Upload form ──
  return (
    <div className="page-desktop">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="md:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Upload Question Paper</p>
          <p className="page-header-sub">PDFs or images · scan effect applied automatically</p>
        </div>
      </div>

      <div className="content-area">
        <div className="mx-auto max-w-lg space-y-5 stagger">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="label">Faculty *</label>
              <select
                value={facultyId}
                onChange={(e) => { setFacultyId(e.target.value); setDepartmentId(''); }}
                className="select-field"
              >
                <option value="">Select faculty</option>
                {FACULTIES.map((f) => (
                  <option key={f.id} value={f.id}>{f.abbreviation} — {f.name.replace('Faculty of ', '')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={!facultyId}
                className="select-field disabled:opacity-40"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div>
              <label className="label">Level *</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="select-field">
                <option value="">Level</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Exam Type *</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value)} className="select-field">
                <option value="">Type</option>
                {EXAM_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Session *</label>
              <select value={session} onChange={(e) => setSession(e.target.value)} className="select-field">
                <option value="">Session</option>
                {ACADEMIC_SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Course Code *</label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g. SWE218"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Question Paper Files *</label>
            <ImageUploader onFilesChange={handleFilesChange} processImage={processImage} />
          </div>

          {error && (
            <div className="rounded-2xl border border-terracotta-100 bg-terracotta-50 px-4 py-3 text-sm text-terracotta animate-fade-in">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !isFormValid}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-40"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon size={16} strokeWidth={2} />
                Upload {files.length} {files.length === 1 ? 'file' : 'files'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadForm />
    </AuthGuard>
  );
}
