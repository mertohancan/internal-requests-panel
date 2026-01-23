import { api, getErrorMessage } from "./api";
import type { User } from "@/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        "/users/login",
        credentials,
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Giriş başarısız"));
    }
  }

  async logout(): Promise<void> {
    await api.post("/users/logout");
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<LoginResponse>("/users/me");

      return response.data.user;
    } catch (error) {
      // If 401, user is not authenticated
      if (
        typeof error === "object" &&
        error &&
        "response" in error &&
        (error as any).response?.status === 401
      ) {
        return null;
      }
      throw new Error(getErrorMessage(error, "Kullanıcı bilgisi alınamadı"));
    }
  }
}

export const authService = new AuthService();
