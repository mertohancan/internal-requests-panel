import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import type { Task } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";

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
      const res = await api.get("/tasks");
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Talepler alınamadı."));
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    task: Omit<Task, "id" | "status" | "createdAt" | "rejectionReason">,
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/tasks", task);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Talep oluşturulamadı."));
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
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
