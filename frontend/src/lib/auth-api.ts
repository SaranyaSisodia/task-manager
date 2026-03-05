// All authentication-related API calls in one place
// Keeps components clean — they just call these functions, not raw axios

import api from './api';
import { AuthResponse, ApiResponse } from '../types';

export const authApi = {
  // Register a new account
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      name, email, password,
    });
    return response.data.data!;
  },

  // Log in with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email, password,
    });
    return response.data.data!;
  },

  // Log out — clears the refresh token on the server
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
