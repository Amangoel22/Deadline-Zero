import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../lib/api';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'College' | 'Coding' | 'Personal' | 'Health' | 'Work';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: TaskPriority;
  duration: string;
  difficulty: TaskDifficulty;
  category: TaskCategory;
  status: TaskStatus;
  isSplit: boolean;
  notes?: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const mapBackendToFrontendTask = (backendTask: any): Task => {
  let status: TaskStatus = 'pending';
  if (backendTask.status === 'IN_PROGRESS') status = 'in-progress';
  else if (backendTask.status === 'COMPLETED') status = 'completed';

  let priority: TaskPriority = 'medium';
  if (backendTask.priority === 'LOW') priority = 'low';
  else if (backendTask.priority === 'MEDIUM') priority = 'medium';
  else if (backendTask.priority === 'HIGH') priority = 'high';
  else if (backendTask.priority === 'CRITICAL') priority = 'critical';

  return {
    id: backendTask.id,
    title: backendTask.title,
    deadline: backendTask.deadline || new Date().toISOString(),
    priority,
    duration: backendTask.estimatedDuration ? `${backendTask.estimatedDuration} min` : '30 min',
    difficulty: 'medium',
    category: (backendTask.category as TaskCategory) || 'Personal',
    status,
    isSplit: false,
    notes: backendTask.description || undefined,
    createdAt: backendTask.createdAt,
  };
};

const mapFrontendToBackendTask = (frontendTask: Partial<Task>) => {
  const result: any = {};
  if (frontendTask.title !== undefined) result.title = frontendTask.title;
  if (frontendTask.deadline !== undefined) result.deadline = frontendTask.deadline;
  if (frontendTask.notes !== undefined) result.description = frontendTask.notes;
  if (frontendTask.category !== undefined) {
    result.category = frontendTask.category.toUpperCase();
  } if (frontendTask.duration !== undefined) {
    const match = frontendTask.duration.match(/\d+/);
    if (match) result.estimatedDuration = parseInt(match[0], 10);
  }

  if (frontendTask.status !== undefined) {
    if (frontendTask.status === 'pending') result.status = 'PENDING';
else if (frontendTask.status === 'in-progress') result.status = 'IN_PROGRESS';
else if (frontendTask.status === 'completed') result.status = 'COMPLETED';
  }

  if (frontendTask.priority !== undefined) {
    if (frontendTask.priority === 'low') result.priority = 'LOW';
    else if (frontendTask.priority === 'medium') result.priority = 'MEDIUM';
    else if (frontendTask.priority === 'high') result.priority = 'HIGH';
    else if (frontendTask.priority === 'critical') result.priority = 'CRITICAL';
  }

  return result;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', {
  params: {
    userId: localStorage.getItem('userId'),
  },
});
      const data = response.data?.data || [];
      setTasks(data.map(mapBackendToFrontendTask));
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {

      const backendPayload = mapFrontendToBackendTask(task);

      await api.post("/tasks", {
  ...backendPayload,
  userId: localStorage.getItem("userId"),
});
      await fetchTasks();
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const backendPayload = mapFrontendToBackendTask(updates);
      await api.patch(`/tasks/${id}`, {
  ...backendPayload,
  userId: localStorage.getItem("userId"),
});
      await fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`, {
  params: {
    userId: localStorage.getItem("userId"),
  },
});
      await fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
