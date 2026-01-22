// Common API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AdminUser;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Moderator" | "Viewer";
}

// Task types
export type Priority = "low" | "normal" | "high" | "urgent";
export type TaskStatus = "pending" | "approved" | "rejected";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
  rejectionReason?: string;
}

// Admin Users types
export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Moderator" | "Viewer";
}

export interface UpdateAdminUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: "Admin" | "Moderator" | "Viewer";
}
