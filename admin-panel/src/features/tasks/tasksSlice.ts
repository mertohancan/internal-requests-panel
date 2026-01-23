import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { tasksService } from "@/services/tasks.service";
import type {
  Task,
  TaskStatus,
  Priority,
  UpdateTaskStatusRequest,
} from "@/services/types";

export type { Priority, TaskStatus };

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await tasksService.fetchTasks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Talepler alınamadı";
      return rejectWithValue(message);
    }
  },
);

// Update task status (approve/reject)
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    {
      id,
      status,
      rejectionReason,
    }: { id: string; status: TaskStatus; rejectionReason?: string },
    { rejectWithValue },
  ) => {
    try {
      const data: UpdateTaskStatusRequest = { status, rejectionReason };
      return await tasksService.updateTaskStatus(id, data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Talep güncellenemedi";
      return rejectWithValue(message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await tasksService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Talep silinemedi";
      return rejectWithValue(message);
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.loading = false;
          const idx = state.items.findIndex((t) => t.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
        },
      )
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
