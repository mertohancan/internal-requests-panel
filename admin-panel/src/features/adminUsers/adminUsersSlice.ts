import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { adminUsersService } from "@/services/adminUsers.service";
import type {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from "@/services/types";

interface AdminUsersState {
  items: AdminUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all admin users
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await adminUsersService.fetchAdminUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kullanıcılar alınamadı";
      return rejectWithValue(message);
    }
  },
);

// Create new admin user
export const createAdminUser = createAsyncThunk(
  "adminUsers/createAdminUser",
  async (data: CreateAdminUserRequest, { rejectWithValue }) => {
    try {
      return await adminUsersService.createAdminUser(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kullanıcı oluşturulamadı";
      return rejectWithValue(message);
    }
  },
);

// Delete admin user
export const deleteAdminUser = createAsyncThunk(
  "adminUsers/deleteAdminUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminUsersService.deleteAdminUser(userId);
      return userId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kullanıcı silinemedi";
      return rejectWithValue(message);
    }
  },
);

// Update admin user
export const updateAdminUser = createAsyncThunk(
  "adminUsers/updateAdminUser",
  async (
    { userId, data }: { userId: string; data: UpdateAdminUserRequest },
    { rejectWithValue },
  ) => {
    try {
      return await adminUsersService.updateAdminUser(userId, data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kullanıcı güncellenemedi";
      return rejectWithValue(message);
    }
  },
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch admin users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action: PayloadAction<AdminUser[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create admin user
      .addCase(createAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAdminUser.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          state.items.push(action.payload);
        },
      )
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete admin user
      .addCase(deleteAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAdminUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter(
            (user) => user.id !== action.payload,
          );
        },
      )
      .addCase(deleteAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update admin user
      .addCase(updateAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAdminUser.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          const index = state.items.findIndex(
            (user) => user.id === action.payload.id,
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        },
      )
      .addCase(updateAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminUsersSlice.reducer;
