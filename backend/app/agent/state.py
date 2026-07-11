"""
LangGraph Agent State

This module defines the shared state passed between every node in the
LangGraph workflow.

Graph Flow:
    START
      ↓
    Agent Node
      ↓
    Tool Node
      ↓
    Agent Node
      ↓
      END

Each node can read and update values in this state.
"""

from typing import Annotated, Any, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """
    Shared state for the HCP CRM LangGraph Agent.

    Attributes
    ----------
    messages:
        Conversation history between the user, AI, and tool outputs.
        The add_messages reducer automatically appends new messages.

    form_data:
        Structured interaction data extracted by AI.
        Used to auto-fill the CRM interaction form.

    suggested_follow_ups:
        AI-generated recommended follow-up actions.

    tool_calls_made:
        Audit trail of every tool executed during the conversation.

    session_id:
        Unique frontend session identifier.

    context:
        Additional runtime context.

        Example:
        {
            "user_id": 12,
            "territory": "East Zone",
            "rep_name": "John",
            "hcp_id": 5
        }

    current_hcp_id:
        Currently selected Healthcare Professional.

    current_interaction_id:
        Interaction currently being edited.

    extracted_entities:
        Entities detected by the LLM before saving.

    ai_summary:
        AI-generated summary of the interaction.

    intent:
        Detected user intent.

        Examples:
            log_interaction
            edit_interaction
            find_hcp
            interaction_history
            suggest_follow_up
    """

    # Conversation history
    messages: Annotated[list[BaseMessage], add_messages]

    # Structured form data returned from Log Interaction Tool
    form_data: dict[str, Any] | None

    # AI suggested next actions
    suggested_follow_ups: list[str] | None

    # Every executed tool
    tool_calls_made: list[dict[str, Any]]

    # Frontend session id
    session_id: str

    # Additional runtime information
    context: dict[str, Any]

    # Current selected HCP
    current_hcp_id: int | None

    # Current interaction
    current_interaction_id: int | None

    # Extracted entities
    extracted_entities: dict[str, Any] | None

    # AI summary
    ai_summary: str | None

    # Current detected intent
    intent: str | None