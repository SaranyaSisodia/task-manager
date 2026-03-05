'use client';

// Individual task card — displays task info with action buttons

import { Task } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit:   (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={clsx(
      'group bg-white rounded-2xl border p-5 transition-all duration-200',
      'hover:shadow-md hover:-translate-y-0.5',
      isCompleted ? 'border-gray-100 opacity-75' : 'border-gray-200 hover:border-brand-200',
    )}>
      {/* Top row: badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <StatusBadge   status={task.status}   />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Action buttons — appear on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggle(task)}
            title="Cycle status"
            className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={clsx(
        'font-semibold text-gray-900 mb-1 line-clamp-2',
        isCompleted && 'line-through text-gray-400'
      )}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Footer: due date + created date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        {task.dueDate ? (
          <span className={clsx(
            'flex items-center gap-1.5 text-xs',
            isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'
          )}>
            <Calendar size={12} />
            {isOverdue ? '⚠ Overdue · ' : ''}
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs text-gray-400">
          {format(new Date(task.createdAt), 'MMM d')}
        </span>
      </div>
    </div>
  );
}
