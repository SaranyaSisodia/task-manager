'use client';

// The main dashboard — this is where all task management happens
// It wires together all our components: TaskCard, TaskForm, filters, pagination

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useRouter } from 'next/navigation';
import { Task } from '../../types';

// Components
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskForm } from '../../components/tasks/TaskForm';
import { TaskFilterBar } from '../../components/tasks/TaskFilterBar';
import { DeleteConfirm } from '../../components/tasks/DeleteConfirm';
import { StatsBar } from '../../components/tasks/StatsBar';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

import { Plus, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  // All task state lives in the useTasks hook
  const {
    tasks, pagination, filters, isLoading,
    fetchTasks, updateFilters, createTask,
    updateTask, deleteTask, toggleTask, goToPage,
  } = useTasks();

  // Modal state — which modal is open and which task is being acted on
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask,     setEditingTask]     = useState<Task | null>(null);
  const [deletingTask,    setDeletingTask]    = useState<Task | null>(null);
  const [isDeleting,      setIsDeleting]      = useState(false);

  // Protect this page: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load tasks when the page mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]); // eslint-disable-line

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = async (data: {
    title: string; description?: string; priority?: string; dueDate?: string;
  }) => {
    try {
      await createTask(data);
      setCreateModalOpen(false);
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleEdit = async (data: {
    title?: string; description?: string; priority?: string;
    dueDate?: string; status?: string;
  }) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await toggleTask(task.id);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Hello, {user?.name}! Here&apos;s your workspace.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus size={18} />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsBar tasks={tasks} totalCount={pagination?.total || 0} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilterBar
          filters={filters}
          onFilterChange={updateFilters}
          totalCount={pagination?.total || 0}
        />
      </div>

      {/* Task Grid */}
      {isLoading ? (
        // Loading skeleton
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Inbox size={28} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No tasks found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {filters.search || filters.status !== 'ALL'
              ? 'Try adjusting your filters'
              : "You don't have any tasks yet. Create your first one!"}
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> Create Task
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t)   => setEditingTask(t)}
              onDelete={(t) => setDeletingTask(t)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </Button>

          <span className="text-sm text-gray-600 font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={!pagination.hasMore}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            onSubmit={handleEdit}
            onCancel={() => setEditingTask(null)}
            defaultValues={editingTask}
            isEditing
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        task={deletingTask}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
