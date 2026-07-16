'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Download, Moon, Info, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

const SETTINGS_ROWS = [
  { label: 'Downloaded subjects', description: 'Offline access', icon: Download, color: 'bg-ink/5' },
  { label: 'Appearance', description: 'Dark mode', icon: Moon, color: 'bg-ink/5' },
  { label: 'Help & Support', description: 'FAQ and contact', icon: HelpCircle, color: 'bg-ink/5' },
  { label: 'About Padi', description: 'Version 1.0', icon: Info, color: 'bg-ink/5' },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user?.name ?? 'Student';
  const displayEmail = user?.email ?? 'Nigerian Army University Biu';

  return (
    <div className="page-desktop-narrow">
      <div className="page-header lg:rounded-card-xl lg:mx-0 lg:my-6">
        <button onClick={() => router.back()} aria-label="Back" className="lg:hidden btn-icon text-paper">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div><p className="page-header-title">Profile</p></div>
      </div>

      <div className="content-area">
        <div className="card-elevated p-6 mb-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-army text-lg font-bold text-white shadow-glow-sm">
              {user ? displayName.charAt(0).toUpperCase() : <User size={22} strokeWidth={1.75} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-heading text-ink truncate">{displayName}</p>
              <p className="text-caption text-muted truncate mt-0.5">{displayEmail}</p>
            </div>
            <Settings size={18} strokeWidth={1.75} className="text-muted/40" />
          </div>
        </div>

        <div className="overflow-hidden rounded-card-xl border border-line bg-white shadow-card">
          {SETTINGS_ROWS.map(({ label, description, icon: Icon, color }, i) => (
            <button
              key={label}
              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-paper ${
                i !== SETTINGS_ROWS.length - 1 ? 'border-b border-line-light' : ''
              }`}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon size={18} strokeWidth={1.75} className="text-ink" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body text-ink font-medium">{label}</p>
                <p className="text-[11px] text-muted">{description}</p>
              </div>
              <ChevronRight size={16} strokeWidth={2} className="text-muted/30" />
            </button>
          ))}
        </div>

        {user && (
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-card-xl btn-danger"
          >
            <LogOut size={16} strokeWidth={2} />
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
