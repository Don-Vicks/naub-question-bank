'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Moon,
  Sun,
  Info,
  LogOut,
  User as UserIcon,
  Shield,
  HelpCircle,
  Bookmark,
  Check,
  Edit3,
  X,
  LogIn,
  UserPlus,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { FACULTIES, LEVELS, getDepartmentsByFaculty } from '@/lib/naub-data';
import { Logo } from '@/components/ui/Logo';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name ?? '');
  const [facultyId, setFacultyId] = useState(user?.facultyId ?? '');
  const [departmentId, setDepartmentId] = useState(user?.departmentId ?? '');
  const [level, setLevel] = useState(user?.level ?? '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<'help' | 'about' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (typeof window !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser({
      name: name.trim() || user.name,
      facultyId: facultyId || undefined,
      departmentId: departmentId || undefined,
      level: level || undefined,
    });
    setEditingProfile(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const departments = facultyId ? getDepartmentsByFaculty(facultyId) : [];

  return (
    <div className="page-desktop-narrow">
      {/* Header */}
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="btn-icon text-paper flex-shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <p className="page-header-title">Profile & Settings</p>
          <p className="page-header-sub">Manage your account and app preferences</p>
        </div>
      </div>

      <div className="content-area">
        {/* Success toast */}
        {savedSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-naub-green-light border border-naub-green/20 px-4 py-3 text-sm font-semibold text-naub-green animate-fade-in">
            <Check size={16} strokeWidth={2.5} />
            Profile updated successfully!
          </div>
        )}

        {/* User Card */}
        {user ? (
          <div className="card-elevated p-6 mb-6 animate-fade-in relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-army text-xl font-bold text-white shadow-glow-sm flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-ink truncate">{user.name}</p>
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-naub-gold-light px-2.5 py-0.5 text-[10px] font-bold text-naub-gold border border-naub-gold/20">
                        <Shield size={10} strokeWidth={2.5} />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-muted truncate mt-0.5">{user.email}</p>
                  {(user.level || user.facultyId) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-army">
                      {user.level && (
                        <span className="rounded-lg bg-army/10 px-2 py-0.5">{user.level}</span>
                      )}
                      {user.facultyId && (
                        <span className="rounded-lg bg-naub-teal/10 text-naub-teal px-2 py-0.5">
                          {user.facultyId.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setName(user.name);
                  setFacultyId(user.facultyId ?? '');
                  setDepartmentId(user.departmentId ?? '');
                  setLevel(user.level ?? '');
                  setEditingProfile(!editingProfile);
                }}
                className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs min-h-[38px] flex-shrink-0"
              >
                {editingProfile ? <X size={14} strokeWidth={2} /> : <Edit3 size={14} strokeWidth={2} />}
                <span>{editingProfile ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Edit Profile Form */}
            {editingProfile && (
              <form onSubmit={handleSaveProfile} className="mt-6 border-t border-line-light pt-5 space-y-4 animate-fade-in-up">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Edit Account Information</p>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">Faculty</label>
                    <select
                      value={facultyId}
                      onChange={(e) => { setFacultyId(e.target.value); setDepartmentId(''); }}
                      className="select-field"
                    >
                      <option value="">Select faculty</option>
                      {FACULTIES.map((f) => (
                        <option key={f.id} value={f.id}>{f.abbreviation}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      disabled={!facultyId}
                      className="select-field disabled:opacity-40"
                    >
                      <option value="">Select dept</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="select-field">
                      <option value="">Level</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="btn-ghost text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs py-2 px-5 min-h-[40px]">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Guest Card */
          <div className="card-interactive p-6 mb-6 animate-fade-in relative overflow-hidden bg-gradient-to-br from-army/5 via-white to-naub-teal/5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/10 text-muted shadow-sm flex-shrink-0">
                <UserIcon size={24} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-ink">Guest Student</p>
                <p className="text-caption text-muted mt-0.5">
                  Sign in to upload past papers, bookmark questions, and save your preferences.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5">
                <LogIn size={14} strokeWidth={2} />
                Sign In
              </Link>
              <Link href="/register" className="btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5">
                <UserPlus size={14} strokeWidth={2} />
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Settings Navigation List */}
        <p className="text-overline uppercase tracking-wider text-muted font-bold mb-3">Preferences & Resources</p>

        <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card mb-6 divide-y divide-line-light">
          {/* Appearance Toggle */}
          <div className="flex items-center justify-between p-4 px-5 hover:bg-paper/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-naub-teal/10 text-naub-teal">
                {darkMode ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
              </div>
              <div>
                <p className="text-body text-ink font-semibold">Appearance</p>
                <p className="text-[11px] text-muted">{darkMode ? 'Dark mode enabled' : 'Light mode enabled'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                darkMode ? 'bg-army' : 'bg-ink/20'
              }`}
              aria-label="Toggle theme"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Saved Shelf */}
          <Link
            href="/bookmarks"
            className="flex items-center justify-between p-4 px-5 hover:bg-paper/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-naub-gold-light text-naub-gold">
                <Bookmark size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-body text-ink font-semibold">Saved Shelf</p>
                <p className="text-[11px] text-muted">View bookmarked courses & questions</p>
              </div>
            </div>
            <ChevronRight size={16} strokeWidth={2} className="text-muted/30 group-hover:translate-x-1 group-hover:text-army transition-all" />
          </Link>

          {/* Downloads / Offline Status */}
          <div className="flex items-center justify-between p-4 px-5 hover:bg-paper/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-naub-green-light text-naub-green">
                <Download size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-body text-ink font-semibold">Offline Storage</p>
                <p className="text-[11px] text-muted">Cached papers for offline reading</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-naub-green bg-naub-green-light px-2.5 py-1 rounded-full border border-naub-green/15">
              Active
            </span>
          </div>

          {/* Help & Support */}
          <button
            onClick={() => setActiveModal('help')}
            className="flex w-full items-center justify-between p-4 px-5 text-left hover:bg-paper/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-army-50 text-army">
                <HelpCircle size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-body text-ink font-semibold">Help & Support</p>
                <p className="text-[11px] text-muted">FAQs and contact details</p>
              </div>
            </div>
            <ChevronRight size={16} strokeWidth={2} className="text-muted/30 group-hover:translate-x-1 group-hover:text-army transition-all" />
          </button>

          {/* About Padi */}
          <button
            onClick={() => setActiveModal('about')}
            className="flex w-full items-center justify-between p-4 px-5 text-left hover:bg-paper/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 text-ink">
                <Info size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-body text-ink font-semibold">About Padi</p>
                <p className="text-[11px] text-muted">Version 1.0.0 · NAUB Question Bank</p>
              </div>
            </div>
            <ChevronRight size={16} strokeWidth={2} className="text-muted/30 group-hover:translate-x-1 group-hover:text-army transition-all" />
          </button>
        </div>

        {/* Sign Out Button */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-terracotta/20 bg-terracotta-50 py-3.5 text-sm font-semibold text-terracotta transition-all hover:bg-terracotta-100 hover:border-terracotta/30 active:scale-[0.98]"
          >
            <LogOut size={16} strokeWidth={2} />
            Sign out of account
          </button>
        )}
      </div>

      {/* Help Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-lg rounded-card-xl bg-white p-6 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line-light pb-4 mb-4">
              <div className="flex items-center gap-2 text-army">
                <HelpCircle size={20} strokeWidth={2} />
                <h3 className="text-lg font-bold text-ink" style={{ fontFamily: "'Lora', Georgia, serif" }}>Help & Support</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="btn-icon">
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <p className="text-sm font-bold text-ink">How do I search for a past question?</p>
                <p className="text-xs text-muted leading-relaxed mt-1">
                  Type your course code (e.g. COS102, SWE218) or topic in the search bar on the Home or Search page.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Can I browse without signing in?</p>
                <p className="text-xs text-muted leading-relaxed mt-1">
                  Yes! All students and guests can freely search, browse by faculty, and view exam papers without logging in.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">How do I upload a past question paper?</p>
                <p className="text-xs text-muted leading-relaxed mt-1">
                  Sign in to your account, click <strong className="text-ink">Upload</strong>, choose your faculty and department, select your PDF or images, and click Upload.
                </p>
              </div>
              <div className="border-t border-line-light pt-3">
                <p className="text-xs font-semibold text-muted">Need further assistance?</p>
                <p className="text-xs text-army font-medium mt-0.5">Contact us at support@padi.naub.edu.ng</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-md rounded-card-xl bg-white p-6 shadow-2xl text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <Logo size="lg" className="justify-center mb-4" />
            <h3 className="text-xl font-bold text-ink" style={{ fontFamily: "'Lora', Georgia, serif" }}>Padi — NAUB Question Bank</h3>
            <p className="text-xs font-semibold text-army mt-1">Version 1.0.0</p>
            <p className="text-xs text-muted leading-relaxed mt-3">
              Padi was built by 3 Software Engineering students at Nigerian Army University Biu to help fellow students study smarter and excel in exams.
            </p>
            <div className="mt-6 border-t border-line-light pt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <Building2 size={14} />
              <span>Nigerian Army University Biu</span>
            </div>
            <button onClick={() => setActiveModal(null)} className="btn-primary w-full mt-5 text-xs py-2.5">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
