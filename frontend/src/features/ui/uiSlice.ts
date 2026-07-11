import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ActiveView, LogMode } from "../../types";



interface UIState {
  activeView: ActiveView;
  logMode: LogMode;
  successMessage: string | null;
  sidebarCollapsed: boolean;
   searchQuery: string;
}

const initialState: UIState = {
  activeView: "log",
  logMode: "form",
  successMessage: null,
  sidebarCollapsed: false,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveView(state, action: PayloadAction<ActiveView>) {
      state.activeView = action.payload;
    },

    setLogMode(state, action: PayloadAction<LogMode>) {
      state.logMode = action.payload;
    },

    showSuccess(state, action: PayloadAction<string>) {
      state.successMessage = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
  },
});

export const {
  setActiveView,
  setLogMode,
  showSuccess,
  clearSuccess,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;