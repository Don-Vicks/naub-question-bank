import { FileText } from 'lucide-react';

interface QuestionCardProps {
  id: string;
  title: string;
}

export function QuestionCard({ id, title }: QuestionCardProps) {
  return (
    <div className="card-interactive group flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ink/5 to-ink/10">
        <FileText size={18} strokeWidth={1.75} className="text-muted" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body text-ink">{title}</p>
      </div>
    </div>
  );
}
