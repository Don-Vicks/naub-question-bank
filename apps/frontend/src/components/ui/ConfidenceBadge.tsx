import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import clsx from 'clsx';
import { ReviewStatus } from '@/lib/types';

const CONFIG: Record<
  ReviewStatus,
  { label: string; className: string; icon: typeof IconCheck | null }
> = {
  approved: {
    label: 'Verified',
    className: 'bg-verified-bg text-verified',
    icon: IconCheck,
  },
  flagged: {
    label: "Still checking",
    className: 'bg-terracotta/10 text-terracotta-text',
    icon: IconAlertTriangle,
  },
  rejected: {
    label: 'Needs correction',
    className: 'bg-terracotta/10 text-terracotta-text',
    icon: IconAlertTriangle,
  },
};

export function ConfidenceBadge({ status }: { status: ReviewStatus }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium',
        className,
      )}
    >
      {Icon && <Icon size={12} stroke={2} />}
      {label}
    </span>
  );
}
