import uuid

from fastapi import APIRouter, Depends
from langchain_core.messages import HumanMessage
from sqlalchemy.ext.asyncio import AsyncSession

from ..agent.graph import build_hcp_agent_graph
from ..agent.state import AgentState
from ..core.database import get_db
from ..schemas.interaction import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["AI Agent"])


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    LangGraph-powered conversational endpoint.
    """

    session_id = request.session_id or str(uuid.uuid4())

    context = request.context or {}

    context_hcps = context.get("hcps", [])

    graph = build_hcp_agent_graph(
        db,
        context_hcps=context_hcps,
    )

    initial_state: AgentState = {
        "messages": [
            HumanMessage(content=request.message)
        ],
        "form_data": None,
        "suggested_follow_ups": None,
        "tool_calls_made": [],
        "session_id": session_id,
        "context": context,
        "current_hcp_id": None,
        "current_interaction_id": None,
        "extracted_entities": None,
        "ai_summary": None,
        "intent": None,
    }

    final_state = await graph.ainvoke(initial_state)

    last_message = final_state["messages"][-1]

    reply = getattr(
        last_message,
        "content",
        "I've processed your request.",
    )

    return ChatResponse(
        reply=reply,
        tool_calls=final_state.get(
            "tool_calls_made",
            [],
        ),
        form_data=final_state.get(
            "form_data",
        ),
        ai_summary=final_state.get(
            "ai_summary",
        ),
        suggested_follow_ups=final_state.get(
            "suggested_follow_ups",
        ),
        session_id=session_id,
    )