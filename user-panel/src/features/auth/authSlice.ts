import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import type { LoginRequest } from "@/services/auth.service";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializing: boolean; // Initial load from backend
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initializing: true, // Start as true until first load completes
};

// Load current user from backend on app start
export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async () => {
    const user = await authService.getCurrentUser();

    return user;
  },
);

// Login with email and password
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const { user } = await authService.login(credentials);
      return user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Giriş başarısız";
      return rejectWithValue(message);
    }
  },
);

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.initializing = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
