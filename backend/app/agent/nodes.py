"""LangGraph graph nodes: agent reasoning and tool execution."""
import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, ToolMessage
from .state import AgentState
from .prompts import SYSTEM_PROMPT
from ..core.config import settings


def build_agent_node(tools: list):
    """Build the agent reasoning node bound to the provided tools."""
    llm = ChatGroq(
        model=settings.groq_model,
        api_key=settings.groq_api_key,
        temperature=0.3,
        max_tokens=1024,
    )
    llm_with_tools = llm.bind_tools(tools)

    async def agent_node(state: AgentState) -> dict:
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
        response = await llm_with_tools.ainvoke(messages)
        return {"messages": [response]}

    return agent_node


def build_tool_node(tools: list):
    """Build the tool execution node that runs called tools and collects results."""
    tool_map = {t.name: t for t in tools}

    async def tool_node(state: AgentState) -> dict:
        last_message = state["messages"][-1]
        tool_calls_made = list(state.get("tool_calls_made", []))
        form_data = state.get("form_data")
        suggested_follow_ups = state.get("suggested_follow_ups")
        tool_messages = []

        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            tool_fn = tool_map.get(tool_name)
            if tool_fn is None:
                result = {"error": f"Tool '{tool_name}' not found"}
            else:
                try:
                    result = await tool_fn.ainvoke(tool_args)
                except Exception as e:
                    result = {"error": str(e)}

            tool_calls_made.append({"tool": tool_name, "result": result})

            # Propagate form_data and follow-ups from tool results
            if isinstance(result, dict):
                if "form_data" in result and result["form_data"]:
                    form_data = result["form_data"]
                if "suggested_follow_ups" in result and result["suggested_follow_ups"]:
                    suggested_follow_ups = result["suggested_follow_ups"]

            tool_messages.append(
                ToolMessage(
                    content=json.dumps(result),
                    tool_call_id=tool_call["id"],
                )
            )

        return {
            "messages": tool_messages,
            "tool_calls_made": tool_calls_made,
            "form_data": form_data,
            "suggested_follow_ups": suggested_follow_ups,
        }

    return tool_node


def should_continue(state: AgentState) -> str:
    """Routing function: continue to tools or end the graph."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return "end"
