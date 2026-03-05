'use client';

// Filter bar at the top of the task dashboard
// Includes search input and status filter tabs

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TaskFilters } from '../../types';
import { clsx } from 'clsx';

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  totalCount: number;
}

const STATUS_TABS = [
  { value: 'ALL',         label: 'All'         },
  { value: 'PENDING',     label: 'Pending'     },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED',   label: 'Completed'   },
];

export function TaskFilterBar({ filters, onFilterChange, totalCount }: TaskFilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search: wait 400ms after typing stops before sending request
  // This prevents an API call on every single keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: search + count */}
      <div className="flex items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-gray-300 transition-all"
          />
          {searchValue && (
            <button
              onClick={() => { setSearchValue(''); onFilterChange({ search: '' }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <span className="text-sm text-gray-500 whitespace-nowrap">
          {totalCount} task{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange({ status: tab.value })}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              filters.status === tab.value
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
