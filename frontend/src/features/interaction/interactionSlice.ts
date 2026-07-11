import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Interaction } from "../../types";
import { getTodayISO, getCurrentTime } from "../../utils/formatters";
import { api } from "../../services/api";

export interface InteractionFormData {
  hcp_id: string;
  interaction_type: string;
  interaction_date: string;
  interaction_time: string;
  attendees: string;
  topics_discussed: string;
  sentiment: string;
  outcomes: string;
  follow_up_actions: string;
  ai_summary: string;
}

interface InteractionState {
  interactions: Interaction[];

  form: InteractionFormData;

  loading: boolean;
  saving: boolean;
  error: string | null;

  editingId: string | null;

  aiSuggestedFollowUps: string[];
}

const defaultForm: InteractionFormData = {
  hcp_id: "",
  interaction_type: "Meeting",
  interaction_date: getTodayISO(),
  interaction_time: getCurrentTime(),
  attendees: "",
  topics_discussed: "",
  sentiment: "neutral",
  outcomes: "",
  follow_up_actions: "",
  ai_summary: "",
};

const initialState: InteractionState = {
  interactions: [],

  form: defaultForm,

  loading: false,
  saving: false,
  error: null,

  editingId: null,

  aiSuggestedFollowUps: [],
};

export const fetchInteractions = createAsyncThunk<
  Interaction[],
  void
>(
  "interaction/fetchAll",
  async () => {
    const response = await api.get<Interaction[]>("/interactions/");
    return response.data;
  }
);

export const saveInteraction = createAsyncThunk(
  "interaction/save",
  async (_, { getState, dispatch }) => {
    const state = getState() as { interaction: InteractionState };

    const { form, editingId } = state.interaction;

    const payload = {
      hcp_id: form.hcp_id || null,

      interaction_type: form.interaction_type,

      interaction_date: form.interaction_date,

      interaction_time: form.interaction_time,

      topics_discussed: form.topics_discussed,

      sentiment: form.sentiment,

      outcomes: form.outcomes,

      follow_up_actions: form.follow_up_actions,

      attendees: form.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await api.patch(`/interactions/${editingId}/`, payload);
    } else {
      await api.post("/interactions/", payload);
    }

    dispatch(fetchInteractions());

    return true;
  }
);

export const createInteraction = createAsyncThunk(
  "interaction/create",
  async (data: InteractionFormData) => {
    const payload = {
      ...data,
      attendees: data.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    const response = await api.post<Interaction>(
      "/interactions/",
      payload
    );

    return response.data;
  }
);

export const updateInteraction = createAsyncThunk(
  "interaction/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: InteractionFormData;
  }) => {
    const payload = {
      ...data,
      attendees: data.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };
    console.log(payload);
    const response = await api.patch<Interaction>(
      `/interactions/${id}/`,
      payload
    );

    return response.data;
  }
);

export const deleteInteraction = createAsyncThunk(
  "interaction/delete",
  async (id: string) => {
    await api.delete(`/interactions/${id}/`);
    return id;
  }
);

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setFormField<K extends keyof InteractionFormData>(
      state: { form: { [x: string]: InteractionFormData[K]; }; },
      action: PayloadAction<{
        field: K;
        value: InteractionFormData[K];
      }>
    ) {
      state.form[action.payload.field] = action.payload.value;
    },

    setForm(state, action: PayloadAction<Partial<InteractionFormData>>) {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },

    resetForm(state) {
      state.form = defaultForm;
      state.editingId = null;
      state.aiSuggestedFollowUps = [];
      state.error = null;
    },

    setEditingInteraction(
      state,
      action: PayloadAction<Interaction>
    ) {
      const interaction = action.payload;

      state.editingId = interaction.id;

      state.form = {
        hcp_id: interaction.hcp_id ?? "",
        interaction_type: interaction.interaction_type,
        interaction_date: interaction.interaction_date,
        interaction_time: interaction.interaction_time ?? "",
        attendees: (interaction.attendees ?? []).join(", "),
        topics_discussed: interaction.topics_discussed ?? "",
        sentiment: interaction.sentiment ?? "neutral",
        outcomes: interaction.outcomes ?? "",
        follow_up_actions:
          interaction.follow_up_actions ?? "",
        ai_summary: interaction.ai_summary ?? "",
      };

      state.aiSuggestedFollowUps =
        interaction.ai_suggested_follow_ups ?? [];
    },

    clearEditingInteraction(state) {
      state.editingId = null;
      state.form = defaultForm;
    },

    setAiSuggestedFollowUps(
      state,
      action: PayloadAction<string[]>
    ) {
      state.aiSuggestedFollowUps = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ==========================
      // Fetch Interactions
      // ==========================
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })

      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch interactions";
      })

      // ==========================
      // Create Interaction
      // ==========================
      .addCase(createInteraction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(createInteraction.fulfilled, (state, action) => {
        state.saving = false;

        state.interactions.unshift(action.payload);

        state.form = defaultForm;

        state.editingId = null;

        state.aiSuggestedFollowUps = [];
      })

      .addCase(createInteraction.rejected, (state, action) => {
        state.saving = false;

        state.error =
          action.error.message ?? "Failed to create interaction";
      })

      // ==========================
      // Update Interaction
      // ==========================
      .addCase(updateInteraction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.saving = false;

        const index = state.interactions.findIndex(
          (i) => i.id === action.payload.id
        );

        if (index !== -1) {
          state.interactions[index] = action.payload;
        }

        state.form = defaultForm;

        state.editingId = null;

        state.aiSuggestedFollowUps = [];
      })

      .addCase(updateInteraction.rejected, (state, action) => {
        state.saving = false;

        state.error =
          action.error.message ?? "Failed to update interaction";
      })

      // ==========================
      // Delete Interaction
      // ==========================
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.interactions = state.interactions.filter(
          (i) => i.id !== action.payload
        );
      })

      .addCase(deleteInteraction.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Failed to delete interaction";
      })
      .addCase(saveInteraction.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(saveInteraction.fulfilled, (state) => {
        state.saving = false;
        state.form = defaultForm;
        state.editingId = null;
      })

      .addCase(saveInteraction.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Failed to save interaction";
      });
  },
});

export const {
  setFormField,
  setForm,
  resetForm,
  setEditingInteraction,
  clearEditingInteraction,
  setAiSuggestedFollowUps,
  clearError,
} = interactionSlice.actions;

export default interactionSlice.reducer;