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

export interface User {
  id: string;
  email: string;
}
