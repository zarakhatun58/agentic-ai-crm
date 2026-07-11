"""
Tool: log_interaction
Captures HCP interaction data from natural language using Groq LLM for
entity extraction and summarization, then persists to the database.
"""
from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.interaction_service import create_from_description


def make_log_interaction_tool(db: AsyncSession, context_hcps: list[dict] | None = None):
    @tool
    async def log_interaction(raw_description: str, hcp_id: str | None = None) -> dict:
        """
        Log a new HCP interaction from a natural language description.

        Uses the LLM to extract structured data including: HCP name, interaction type,
        date, topics discussed, sentiment (positive/neutral/negative), outcomes, and
        follow-up actions. The extracted data is saved to the database and the
        structured form_data is returned to auto-populate the frontend form.

        Args:
            raw_description: Natural language description of the interaction
                (e.g. "Met Dr. Smith today, discussed OncoBoost Phase III results, positive")
            hcp_id: Optional HCP UUID if already known from the UI context
        """
        return await create_from_description(
            db=db,
            raw_description=raw_description,
            hcp_id=hcp_id,
            context_hcps=context_hcps,
        )

    return log_interaction
