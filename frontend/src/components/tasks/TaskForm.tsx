'use client';

// Reusable form for both creating and editing tasks
// react-hook-form handles form state, validation, and submission

import { useForm } from 'react-hook-form';
import { Task } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskFormData {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<Task>;
  isEditing?: boolean;
}

export function TaskForm({ onSubmit, onCancel, defaultValues, isEditing = false }: TaskFormProps) {
  const {
    register,       // Connects inputs to the form
    handleSubmit,   // Wraps submit handler with validation
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: {
      title:       defaultValues?.title || '',
      description: defaultValues?.description || '',
      priority:    defaultValues?.priority    || 'MEDIUM',
      status:      defaultValues?.status      || 'PENDING',
      // Format date for the input (YYYY-MM-DD)
      dueDate:     defaultValues?.dueDate
        ? new Date(defaultValues.dueDate).toISOString().split('T')[0]
        : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Title */}
      <Input
        label="Task Title"
        placeholder="e.g. Review pull request"
        required
        error={errors.title?.message}
        {...register('title', {
          required: 'Title is required',
          maxLength: { value: 200, message: 'Max 200 characters' },
        })}
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Optional details about this task..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-gray-300 placeholder:text-gray-400 transition-all"
          {...register('description')}
        />
      </div>

      {/* Priority + Due Date row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-gray-300 transition-all bg-white"
            {...register('priority')}
          >
            <option value="LOW">↓ Low</option>
            <option value="MEDIUM">→ Medium</option>
            <option value="HIGH">↑ High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          type="date"
          {...register('dueDate')}
        />
      </div>

      {/* Status (only shown when editing) */}
      {isEditing && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-gray-300 transition-all bg-white"
            {...register('status')}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
