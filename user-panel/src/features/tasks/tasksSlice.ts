import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { tasksService } from "@/services/tasks.service";
import type { CreateTaskRequest } from "@/services/tasks.service";
import type { Task } from "@/types";

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

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await tasksService.fetchTasks();
      return tasks;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Talepler alınamadı";
      return rejectWithValue(message);
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const newTask = await tasksService.createTask(task);
      return newTask;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Talep oluşturulamadı";
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
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
        // Socket middleware will update tasks, no need to modify state here
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
