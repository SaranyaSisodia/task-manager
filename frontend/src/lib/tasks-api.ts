// All task-related API calls in one place

import api from './api';
import { Task, TasksResponse, ApiResponse, TaskFilters } from '../types';

export const tasksApi = {
  // Fetch tasks with optional filters
  async getTasks(filters: Partial<TaskFilters> = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);

    const response = await api.get<ApiResponse<TasksResponse>>(`/tasks?${params}`);
    return response.data.data!;
  },

  // Get a single task by ID
  async getTask(id: number): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  },

  // Create a new task
  async createTask(data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data!;
  },

  // Update an existing task
  async updateTask(id: number, data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data!;
  },

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  // Cycle the task status (PENDING → IN_PROGRESS → COMPLETED → PENDING)
  async toggleTask(id: number): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return response.data.data!;
  },
};
