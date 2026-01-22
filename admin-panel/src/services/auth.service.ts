import { api, getErrorMessage } from "./api";
import type { LoginRequest, LoginResponse, AdminUser } from "./types";

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        "/admin/login",
        credentials,
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Giriş başarısız"));
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/admin/logout");
    } finally {
      localStorage.removeItem("admin_user");
    }
  }

  loadUserFromStorage(): AdminUser | null {
    const userStr = localStorage.getItem("admin_user");

    if (!userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr) as AdminUser;
      return user;
    } catch {
      localStorage.removeItem("admin_user");
      return null;
    }
  }

  saveAuth(user: AdminUser): void {
    localStorage.setItem("admin_user", JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("admin_user");
  }

  getUserRole(): AdminUser["role"] | null {
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr) as AdminUser;
      return user.role;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
