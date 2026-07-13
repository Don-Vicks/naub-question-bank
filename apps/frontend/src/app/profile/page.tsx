import { IconChevronRight, IconDownload, IconMoon, IconInfoCircle } from '@tabler/icons-react';

const ROWS = [
  { label: 'Downloaded subjects', icon: IconDownload },
  { label: 'Dark mode', icon: IconMoon },
  { label: 'About Padi', icon: IconInfoCircle },
];

export default function ProfilePage() {
  return (
    <div className="p-4 md:mx-auto md:max-w-md md:px-0 md:py-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-marigold text-sm font-medium text-marigold-text">
          V
        </div>
        <div>
          <p className="text-[13px] font-medium text-ink">Victor</p>
          <p className="text-[11px] text-muted">SWE218 · COS201 · CSC211</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-white">
        {ROWS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 px-3 py-3 text-left ${
              i !== ROWS.length - 1 ? 'border-b border-line' : ''
            }`}
          >
            <Icon size={18} stroke={1.75} className="text-ink" />
            <span className="flex-1 text-[13px] text-ink">{label}</span>
            <IconChevronRight size={16} stroke={1.75} className="text-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}
