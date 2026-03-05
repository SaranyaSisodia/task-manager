import { Response } from 'express';
import { taskService } from '../services/task.service';
import { AuthenticatedRequest, TaskQueryParams } from '../types';

export const taskController = {
  // GET /tasks?page=1&limit=10&status=PENDING&search=meeting
  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await taskService.getTasks(req.user!.userId, req.query as TaskQueryParams);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      res.status(500).json({ success: false, message });
    }
  },

  // GET /tasks/:id
  async getTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.getTaskById(parseInt(req.params.id), req.user!.userId);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch task';
      res.status(message === 'Task not found' ? 404 : 500).json({ success: false, message });
    }
  },

  // POST /tasks
  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.createTask(req.user!.userId, req.body);
      res.status(201).json({ success: true, message: 'Task created successfully', data: task });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      res.status(500).json({ success: false, message });
    }
  },

  // PATCH /tasks/:id
  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.updateTask(parseInt(req.params.id), req.user!.userId, req.body);
      res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      res.status(message === 'Task not found' ? 404 : 500).json({ success: false, message });
    }
  },

  // DELETE /tasks/:id
  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await taskService.deleteTask(parseInt(req.params.id), req.user!.userId);
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      res.status(message === 'Task not found' ? 404 : 500).json({ success: false, message });
    }
  },

  // PATCH /tasks/:id/toggle
  async toggleTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.toggleTask(parseInt(req.params.id), req.user!.userId);
      res.status(200).json({ success: true, message: 'Task status updated', data: task });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle task';
      res.status(message === 'Task not found' ? 404 : 500).json({ success: false, message });
    }
  },
};
