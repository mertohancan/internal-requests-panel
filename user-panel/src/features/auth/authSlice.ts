import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/api";

interface AuthState {
  user: { id: string; email: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// LocalStorage'dan kullanıcıyı yükleyen thunk
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return { id: user.id, email: user.email };
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      // Yeni login endpoint'ini kullan
      const res = await api.post("/users/login", { email, password });
      const user = res.data.user;

      // Kullanıcıyı localStorage'a kaydet (token cookie'de)
      localStorage.setItem("user", JSON.stringify(user));
      return { id: user.id, email: user.email };
    } catch (err) {
      if (
        typeof err === "object" &&
        err &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        return rejectWithValue(
          (err.response as any).data.error || "Giriş başarısız.",
        );
      }
      return rejectWithValue("Giriş başarısız.");
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/users/logout");
  } finally {
    localStorage.removeItem("user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        loadUserFromStorage.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; email: string } | null>,
        ) => {
          if (action.payload) {
            state.user = action.payload;
          }
        },
      )
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ id: string; email: string }>) => {
          state.loading = false;
          state.user = action.payload;
        },
      )
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
