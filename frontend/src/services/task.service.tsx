import api from "../lib/api";

const getUserId = () => localStorage.getItem("userId");

export const taskService = {
  async getTasks() {
    const response = await api.get("/tasks", {
      params: {
        userId: getUserId(),
      },
    });

    return response.data.data;
  },

  async createTask(task: any) {
    const response = await api.post("/tasks", {
      ...task,
      userId: getUserId(),
    });

    return response.data.data;
  },

  async updateTask(id: string, updates: any) {
    const response = await api.patch(`/tasks/${id}`, {
      ...updates,
      userId: getUserId(),
    });

    return response.data.data;
  },

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`, {
      params: {
        userId: getUserId(),
      },
    });
  },
};