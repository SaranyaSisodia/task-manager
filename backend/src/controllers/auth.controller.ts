import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

// Controllers are intentionally thin — they just handle HTTP and delegate to services
export const authController = {
  // POST /auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      const statusCode = message.includes('already registered') ? 409 : 500;
      res.status(statusCode).json({ success: false, message });
    }
  },

  // POST /auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ success: false, message });
    }
  },

  // POST /auth/refresh
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token required' });
        return;
      }

      const result = await authService.refresh(refreshToken);
      res.status(200).json({ success: true, message: 'Token refreshed', data: result });
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  },

  // POST /auth/logout  (protected route)
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await authService.logout(req.user!.userId);
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch {
      res.status(500).json({ success: false, message: 'Logout failed' });
    }
  },
};
