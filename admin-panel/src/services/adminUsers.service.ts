import { api, getErrorMessage } from "./api";
import type {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from "./types";

/**
 * Admin Users Service - Handles admin user management API calls
 */
class AdminUsersService {
  /**
   * Fetch all admin users
   */
  async fetchAdminUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get<AdminUser[]>("/adminUsers");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Kullanıcılar alınamadı"));
    }
  }

  /**
   * Create a new admin user
   */
  async createAdminUser(data: CreateAdminUserRequest): Promise<AdminUser> {
    try {
      const response = await api.post<AdminUser>("/adminUsers", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Kullanıcı oluşturulamadı"));
    }
  }

  /**
   * Delete an admin user
   */
  async deleteAdminUser(userId: string): Promise<void> {
    try {
      await api.delete(`/adminUsers/${userId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Kullanıcı silinemedi"));
    }
  }

  /**
   * Get admin user by ID
   */
  async getAdminUserById(userId: string): Promise<AdminUser> {
    try {
      const response = await api.get<AdminUser>(`/adminUsers/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Kullanıcı bulunamadı"));
    }
  }

  /**
   * Update an admin user
   */
  async updateAdminUser(
    userId: string,
    data: UpdateAdminUserRequest,
  ): Promise<AdminUser> {
    try {
      const response = await api.patch<AdminUser>(
        `/adminUsers/${userId}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Kullanıcı güncellenemedi"));
    }
  }
}

export const adminUsersService = new AdminUsersService();
