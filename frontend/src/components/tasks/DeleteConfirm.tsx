'use client';

import { Task } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmProps {
  task: Task | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirm({ task, onConfirm, onCancel, isDeleting }: DeleteConfirmProps) {
  return (
    <Modal isOpen={!!task} onClose={onCancel} title="Delete Task" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Are you sure?</p>
          <p className="text-sm text-gray-500 mt-1">
            &ldquo;{task?.title}&rdquo; will be permanently deleted.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting} className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
