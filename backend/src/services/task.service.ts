import prisma from '../utils/prisma';
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from '../types';

export const taskService = {
  // Fetches tasks for a user with optional pagination, status filter, and search
  async getTasks(userId: number, query: TaskQueryParams) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // Build the where clause dynamically based on query params
    const where: {
      userId: number;
      status?: string;
      title?: { contains: string };
    } = { userId };

    if (query.status && ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(query.status)) {
      where.status = query.status;
    }

    if (query.search) {
      where.title = { contains: query.search };
    }

    // Run both queries in parallel — count is needed for pagination metadata
    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
    };
  },

  // Get a single task — verifies it belongs to the requesting user
  async getTaskById(taskId: number, userId: number) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new Error('Task not found');
    return task;
  },

  // Creates a new task linked to the user
  async createTask(userId: number, data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId,
      },
    });
  },

  // Updates only the fields provided (partial update)
  async updateTask(taskId: number, userId: number, data: UpdateTaskInput) {
    await this.getTaskById(taskId, userId); // Ownership check

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        updatedAt: new Date(),
      },
    });
  },

  // Deletes a task after verifying ownership
  async deleteTask(taskId: number, userId: number) {
    await this.getTaskById(taskId, userId); // Ownership check
    await prisma.task.delete({ where: { id: taskId } });
  },

  // Cycles status: PENDING → IN_PROGRESS → COMPLETED → PENDING
  async toggleTask(taskId: number, userId: number) {
    const task = await this.getTaskById(taskId, userId);

    const statusCycle: Record<string, string> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'PENDING',
    };

    return prisma.task.update({
      where: { id: taskId },
      data: { status: statusCycle[task.status] },
    });
  },
};