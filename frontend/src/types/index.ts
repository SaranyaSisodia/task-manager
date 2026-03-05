// All shared TypeScript types for the frontend
// Keeping types in one place makes them easy to find and update

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: Pagination;
}

// The shape of tokens returned after login/register
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// API response wrapper — every endpoint returns this shape
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface TaskFilters {
  page: number;
  limit: number;
  status: string;
  search: string;
}
