import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { HCP } from "../../types";
import { api } from "../../services/api";


interface HCPState {
  hcps: HCP[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: HCPState = {
  hcps: [],
  loading: false,
  error: null,
  searchQuery: "",
};

/**
 * Get all HCPs
 * GET /hcps?search=
 */
export const fetchHCPs = createAsyncThunk<
  HCP[],
  string | undefined
>(
  "hcp/fetchAll",
  async (search = "") => {
    const response = await api.get<HCP[]>("/hcps/", {
      params: search ? { search } : {},
    });

    return response.data;
  }
);

/**
 * Create HCP
 * POST /hcps
 */
export const createHCP = createAsyncThunk(
  "hcp/create",
  async (data: Partial<HCP>) => {
    const response = await api.post<HCP>(
      "/hcps/",
      data
    );

    return response.data;
  }
);

/**
 * Update HCP
 * PATCH /hcps/{id}
 */
export const updateHCP = createAsyncThunk(
  "hcp/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<HCP>;
  }) => {
    const response = await api.patch<HCP>(
      `/hcps/${id}/`,
      data
    );

    return response.data;
  }
);

/**
 * Delete HCP
 * DELETE /hcps/{id}
 */
export const deleteHCP = createAsyncThunk(
  "hcp/delete",
  async (id: string) => {
    await api.delete(`/hcps/${id}/`);

    return id;
  }
);

const hcpSlice = createSlice({
  name: "hcp",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    clearHCPError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchHCPs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHCPs.fulfilled, (state, action) => {
        state.loading = false;
        state.hcps = action.payload;
      })

      .addCase(fetchHCPs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch HCPs";
      })

      // Create
      .addCase(createHCP.fulfilled, (state, action) => {
        state.hcps.unshift(action.payload);
      })

      .addCase(createHCP.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to create HCP";
      })

      // Update
      .addCase(updateHCP.fulfilled, (state, action) => {
        const index = state.hcps.findIndex(
          (hcp) => hcp.id === action.payload.id
        );

        if (index !== -1) {
          state.hcps[index] = action.payload;
        }
      })

      .addCase(updateHCP.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to update HCP";
      })

      // Delete
      .addCase(deleteHCP.fulfilled, (state, action) => {
        state.hcps = state.hcps.filter(
          (hcp) => hcp.id !== action.payload
        );
      })

      .addCase(deleteHCP.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to delete HCP";
      });
  },
});

export const {
  setSearchQuery,
  clearHCPError,
} = hcpSlice.actions;

export default hcpSlice.reducer;