import { cn } from '@/lib/utils';
import { AttendanceRecord } from '@/types/auth';

interface StatusBadgeProps {
  status: AttendanceRecord['status'];
  className?: string;
}

const statusConfig = {
  present: {
    label: 'Present',
    className: 'bg-success/10 text-success border-success/20',
  },
  absent: {
    label: 'Absent',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  late: {
    label: 'Late',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  'half-day': {
    label: 'Half Day',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
