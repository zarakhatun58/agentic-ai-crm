from datetime import date, datetime, time
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from .hcp import HCPResponse


class InteractionBase(BaseModel):
    hcp_id: str | None = None
    interaction_type: str = "Meeting"
    interaction_date: date
    interaction_time: time | None = None
    attendees: list[str] = Field(default_factory=list)
    topics_discussed: str | None = None
    sentiment: str = "neutral"
    outcomes: str | None = None
    follow_up_actions: str | None = None
    logged_via: str = "form"


# -----------------------------
# Create Interaction
# -----------------------------
class InteractionCreate(InteractionBase):
    ai_summary: str | None = None
    ai_suggested_follow_ups: list[str] = Field(default_factory=list)


# -----------------------------
# Update Interaction
# -----------------------------
class InteractionUpdate(BaseModel):
    hcp_id: str | None = None
    interaction_type: str | None = None
    interaction_date: date | None = None
    interaction_time: time | None = None
    attendees: list[str] | None = None
    topics_discussed: str | None = None
    sentiment: str | None = None
    outcomes: str | None = None
    follow_up_actions: str | None = None

    ai_summary: str | None = None
    ai_suggested_follow_ups: list[str] | None = None


# -----------------------------
# Response
# -----------------------------
class InteractionResponse(InteractionBase):
    id: str

    ai_summary: str | None = None
    ai_suggested_follow_ups: list[str] | None = None

    created_at: datetime
    updated_at: datetime

    hcp: HCPResponse | None = None

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# Chat Request
# -----------------------------
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    context: dict[str, Any] = Field(default_factory=dict)


# -----------------------------
# Chat Response
# -----------------------------
class ChatResponse(BaseModel):
    reply: str

    tool_calls: list[dict[str, Any]] = Field(default_factory=list)

    form_data: dict[str, Any] | None = None

    ai_summary: str | None = None

    suggested_follow_ups: list[str] | None = None

    session_id: str