import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

interface AuthState {
  loading: boolean;
  authRequired: boolean;
}

const initialState: AuthState = {
  loading: false,
  authRequired: false,
};

interface AuthStatusResponse {
  mode: string;
  auth_required: boolean;
}

export const checkAuth = createAsyncThunk<
  AuthStatusResponse
>(
  "auth/status",
  async () => {
    const response = await api.get<AuthStatusResponse>("/auth/status");
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authRequired = action.payload.auth_required;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;