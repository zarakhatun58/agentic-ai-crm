"""
LangGraph Agent Graph — HCP CRM Module

Graph topology:
    START → agent_node → (should_continue) → tool_node → agent_node → ... → END

The agent uses a ReAct-style loop:
1. agent_node: Groq LLM reasons and decides which tool(s) to call
2. tool_node: executes the chosen tool(s) against the database
3. Loops back to agent_node for final response synthesis
"""
from langgraph.graph import StateGraph, START, END
from sqlalchemy.ext.asyncio import AsyncSession
from .state import AgentState
from .nodes import build_agent_node, build_tool_node, should_continue
from ..tools.log_interaction import make_log_interaction_tool
from ..tools.edit_interaction import make_edit_interaction_tool
from ..tools.interaction_history import make_interaction_history_tool
from ..tools.followup_suggestion import make_suggest_follow_ups_tool
from ..tools.find_hcp import make_find_hcp_tool


def build_hcp_agent_graph(db: AsyncSession, context_hcps: list[dict] | None = None):
    """
    Construct and compile the LangGraph StateGraph for the HCP CRM agent.

    Returns a compiled graph ready for ainvoke().
    """
    # Instantiate all 5 tools with DB access
    tools = [
        make_log_interaction_tool(db, context_hcps),
        make_edit_interaction_tool(db),
        make_interaction_history_tool(db),
        make_suggest_follow_ups_tool(db),
        make_find_hcp_tool(db),
    ]

    agent_node = build_agent_node(tools)
    tool_node = build_tool_node(tools)

    # Build the state graph
    builder = StateGraph(AgentState)
    builder.add_node("agent", agent_node)
    builder.add_node("tools", tool_node)

    builder.add_edge(START, "agent")
    builder.add_conditional_edges(
        "agent",
        should_continue,
        {"tools": "tools", "end": END},
    )
    builder.add_edge("tools", "agent")

    return builder.compile()
