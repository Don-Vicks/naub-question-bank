import { Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { ReviewStatus } from '@/lib/types';

const CONFIG: Record<
  ReviewStatus,
  { label: string; className: string; icon: typeof Check | null }
> = {
  approved: {
    label: 'Verified',
    className: 'badge-success',
    icon: Check,
  },
  flagged: {
    label: 'Checking',
    className: 'badge-gold',
    icon: AlertTriangle,
  },
  rejected: {
    label: 'Needs fix',
    className: 'badge-danger',
    icon: AlertTriangle,
  },
};

export function ConfidenceBadge({ status }: { status: ReviewStatus }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', className)}>
      {Icon && <Icon size={10} strokeWidth={2.5} />}
      {label}
    </span>
  );
}
