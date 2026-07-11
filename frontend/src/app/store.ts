import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import hcpReducer from "../features/hcp/hcpSlice";
import interactionReducer from "../features/interaction/interactionSlice";
import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,                 // authentication
    ui: uiReducer,                     // UI state
    hcp: hcpReducer,                   // HCPs
    interaction: interactionReducer,   // Interactions
    agent: chatReducer,                // AI Chat
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;