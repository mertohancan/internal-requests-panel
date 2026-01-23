import { api, getErrorMessage } from "./api";
import type { Task } from "@/types";

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: Task["priority"];
  category: string;
  createdBy: string;
}

class TasksService {
  async fetchTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>("/tasks");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talepler alınamadı"));
    }
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post<Task>("/tasks", task);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talep oluşturulamadı"));
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talep bulunamadı"));
    }
  }
}

export const tasksService = new TasksService();
