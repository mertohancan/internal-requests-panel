import { api, getErrorMessage } from "./api";
import type { Task, UpdateTaskStatusRequest } from "./types";

/**
 * Tasks Service - Handles all task related API calls
 */
class TasksService {
  /**
   * Fetch all tasks
   */
  async fetchTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>("/tasks");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talepler alınamadı"));
    }
  }

  /**
   * Update task status (approve/reject)
   */
  async updateTaskStatus(
    taskId: string,
    data: UpdateTaskStatusRequest,
  ): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${taskId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talep güncellenemedi"));
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<Task> {
    try {
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Talep bulunamadı"));
    }
  }
}

export const tasksService = new TasksService();
