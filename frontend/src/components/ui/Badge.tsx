// Badge component for displaying status and priority labels
import { clsx } from 'clsx';
import { TaskStatus, Priority } from '../../types';

// Status badge — shows colored dot + label
export function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    PENDING:     'bg-amber-50  text-amber-700  border-amber-200',
    IN_PROGRESS: 'bg-blue-50   text-blue-700   border-blue-200',
    COMPLETED:   'bg-green-50  text-green-700  border-green-200',
  };

  const dots: Record<TaskStatus, string> = {
    PENDING:     'bg-amber-500',
    IN_PROGRESS: 'bg-blue-500',
    COMPLETED:   'bg-green-500',
  };

  const labels: Record<TaskStatus, string> = {
    PENDING:     'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED:   'Completed',
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      styles[status]
    )}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dots[status])} />
      {labels[status]}
    </span>
  );
}

// Priority badge — shows colored label
export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    LOW:    'bg-gray-100   text-gray-600',
    MEDIUM: 'bg-orange-100 text-orange-700',
    HIGH:   'bg-red-100    text-red-700',
  };

  const icons: Record<Priority, string> = {
    LOW: '↓', MEDIUM: '→', HIGH: '↑',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium', styles[priority])}>
      <span>{icons[priority]}</span>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}
