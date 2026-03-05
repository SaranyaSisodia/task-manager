'use client';

// Custom hook that encapsulates all task-related state and operations
// Components just call this hook — they don't manage state themselves

import { useState, useCallback } from 'react';
import { Task, TaskFilters, Pagination } from '../types';
import { tasksApi } from '../lib/tasks-api';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: TaskFilters = {
  page: 1,
  limit: 10,
  status: 'ALL',
  search: '',
};

export function useTasks() {
  const [tasks,      setTasks]      = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters,    setFilters]    = useState<TaskFilters>(DEFAULT_FILTERS);
  const [isLoading,  setIsLoading]  = useState(false);

  // Fetches tasks from the API — useCallback prevents re-creation on every render
  const fetchTasks = useCallback(async (overrideFilters?: Partial<TaskFilters>) => {
    setIsLoading(true);
    try {
      const activeFilters = { ...filters, ...overrideFilters };
      const data = await tasksApi.getTasks(activeFilters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Updates filters and re-fetches
  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 on filter change
    setFilters(updated);
    fetchTasks(updated);
  };

  const createTask = async (data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }) => {
    const task = await tasksApi.createTask(data);
    toast.success('Task created!');
    fetchTasks(); // Refresh the list
    return task;
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    const task = await tasksApi.updateTask(id, data);
    toast.success('Task updated!');
    fetchTasks();
    return task;
  };

  const deleteTask = async (id: number) => {
    await tasksApi.deleteTask(id);
    toast.success('Task deleted');
    fetchTasks();
  };

  const toggleTask = async (id: number) => {
    const task = await tasksApi.toggleTask(id);
    // Optimistic update: immediately update UI without waiting for re-fetch
    setTasks(prev => prev.map(t => t.id === id ? task : t));
    return task;
  };

  const goToPage = (page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    fetchTasks(updated);
  };

  return {
    tasks,
    pagination,
    filters,
    isLoading,
    fetchTasks,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    goToPage,
  };
}
