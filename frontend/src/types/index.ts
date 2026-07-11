export interface HCP {
  id: string;
  name: string;
  specialty: string | null;
  institution: string |null;
  email: string | null;
  phone: string | null;
  territory: string | null;
  tier: string | null;
  created_at: string;
}

export interface Interaction {
  id: string;
  hcp_id: string | null;

  interaction_type: string;
  interaction_date: string;
  interaction_time?: string | null;

  attendees: string[];

  topics_discussed?: string | null;

  sentiment: "positive" | "neutral" | "negative";

  outcomes?: string | null;

  follow_up_actions?: string | null;

  ai_summary?: string | null;

  ai_suggested_follow_ups?: string[];

  logged_via: string;

  created_at: string;
  updated_at: string;

  hcp?: HCP;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}
export interface ToolCall {
  tool: string;
  result: unknown;
}
export interface ChatResponse {
  reply: string;
  tool_calls: ToolCall[];
  form_data?: Record<string, unknown>;
  ai_summary?: string;
  suggested_follow_ups?: string[];
  session_id: string;
}

export type SentimentType =
  | "positive"
  | "neutral"
  | "negative";

export type InteractionType =
  | "Meeting"
  | "Call"
  | "Email"
  | "Conference"
  | "Dinner Program"
  | "Virtual";

export type LogMode = "form" | "chat";

export type ActiveView = "dashboard" | "log" | "history" | "chat";