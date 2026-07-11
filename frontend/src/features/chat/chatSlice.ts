import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { ChatResponse } from "../../types";

export type ChatRole = "user" | "assistant" | "tool";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  toolName?: string;
  toolResult?: unknown;
  timestamp: string;
}

interface AgentState {
  messages: ChatMessage[];
  sessionId: string;
  inputText: string;
  isThinking: boolean;
  error: string | null;
  formData: Record<string, unknown> | null;
  aiSummary: string | null;
  suggestedFollowUps: string[];
}
export interface ToolCall {
  tool: string;
  result: unknown;
}


const initialState: AgentState = {
  messages: [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. Tell me about an HCP interaction or ask me anything.",
      timestamp: new Date().toISOString(),
    },
  ],
  sessionId: crypto.randomUUID(),
  inputText: "",
  isThinking: false,
  error: null,
  formData: null,
  aiSummary: null,
  suggestedFollowUps: [],
};

export const sendAgentMessage = createAsyncThunk<
  ChatResponse,
  {
    message: string;
    context?: Record<string, unknown>;
  },
  {
    state: {
      agent: AgentState;
    };
  }
>(
  "agent/sendMessage",
  async ({ message, context }, { getState }) => {
    const state = getState().agent;

    const response = await api.post<ChatResponse>(
      "/chat/",
      {
        message,
        session_id: state.sessionId,
        context: context ?? {},
      }
    );

    return response.data;
  }
);

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setInputText(state, action: PayloadAction<string>) {
      state.inputText = action.payload;
    },

    clearChat(state) {
      state.messages = [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Hello! I'm your AI assistant. Tell me about an HCP interaction or ask me anything.",
          timestamp: new Date().toISOString(),
        },
      ];

      state.sessionId = crypto.randomUUID();
      state.error = null;
      state.formData = null;
      state.aiSummary = null;
      state.suggestedFollowUps = [];
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers(builder) {
    builder

      // Pending
      .addCase(sendAgentMessage.pending, (state, action) => {
        state.isThinking = true;
        state.error = null;

        state.messages.push({
          id: crypto.randomUUID(),
          role: "user",
          content: action.meta.arg.message,
          timestamp: new Date().toISOString(),
        });
      })

      // Success
      .addCase(sendAgentMessage.fulfilled, (state, action) => {
        state.isThinking = false;

        const data = action.payload;
        state.formData = data.form_data ?? null;
        state.aiSummary = data.ai_summary ?? null;

        state.suggestedFollowUps =
          data.suggested_follow_ups ?? [];
        if (data.tool_calls.length) {
          data.tool_calls.forEach((tool) => {
            state.messages.push({
              id: crypto.randomUUID(),
              role: "tool",
              content: JSON.stringify(tool.result, null, 2),
              toolName: tool.tool,
              toolResult: tool.result,
              timestamp: new Date().toISOString(),
            });
          });
        }

        state.messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toISOString(),
        });

        state.inputText = "";
      })

      // Error
      .addCase(sendAgentMessage.rejected, (state, action) => {
        state.isThinking = false;

        state.error =
          action.error.message || "Unable to communicate with AI";

        state.messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, something went wrong while contacting the AI.",
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const {
  setInputText,
  clearChat,
  clearError,
} = agentSlice.actions;

export default agentSlice.reducer;