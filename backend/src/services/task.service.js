import prisma from "../config/prisma.js";

class TaskService {
  async createTask(taskData) {
    const userId = taskData.userId;

    const users = await prisma.user.findMany();

    const user = await prisma.user.findUnique({
      where: {
        id: taskData.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.task.create({
      data: taskData,
    });
  }

  async getTasks(filters) {
    const where = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.priority) where.priority = filters.priority;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;

    return await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async getTaskById(id, userId) {
    return await prisma.task.findFirst({
      where: { id, userId },
    });
  }

  async updateTask(id, userId, updateData) {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return null;
    }

    return await prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id, userId) {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return null;
    }

    return await prisma.task.delete({
      where: { id },
    });
  }
}

export default new TaskService();
