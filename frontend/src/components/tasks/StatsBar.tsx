'use client';

import { Task } from '../../types';
import { CheckCircle, Clock, Zap, ListTodo } from 'lucide-react';

interface StatsBarProps {
  tasks: Task[];
  totalCount: number;
}

export function StatsBar({ tasks, totalCount }: StatsBarProps) {
  // Calculate counts from the current visible tasks
  // In a real app you'd get these from a dedicated API endpoint
  const pending     = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress  = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed   = tasks.filter(t => t.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total',       value: totalCount, icon: ListTodo,    color: 'text-gray-600',   bg: 'bg-gray-100'   },
    { label: 'Pending',     value: pending,    icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50'   },
    { label: 'In Progress', value: inProgress, icon: Zap,         color: 'text-blue-600',   bg: 'bg-blue-50'    },
    { label: 'Completed',   value: completed,  icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50'   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
