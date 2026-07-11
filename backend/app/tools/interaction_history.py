"""
Tool: get_interaction_history
Retrieves past interaction records for a specific HCP or across all HCPs,
enabling the agent to provide historical context and trend analysis.
"""
from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession
from ..crud.interaction import get_all
from ..crud.hcp import get_all as get_all_hcps


def make_interaction_history_tool(db: AsyncSession):
    @tool
    async def get_interaction_history(
        hcp_name: str | None = None,
        limit: int = 5,
    ) -> dict:
        """
        Retrieve past interaction history for an HCP or across all HCPs.

        Returns recent interactions with their key details including type, date,
        topics discussed, sentiment, and outcomes. Useful for providing context
        before a new interaction or reviewing rep activity.

        Args:
            hcp_name: Name or partial name of the HCP to filter by (optional)
            limit: Maximum number of interactions to return (default 5, max 20)
        """
        limit = min(limit, 20)
        hcp_id = None

        if hcp_name:
            hcps = await get_all_hcps(db, search=hcp_name)
            if hcps:
                hcp_id = hcps[0].id

        interactions = await get_all(db, hcp_id=hcp_id, limit=limit)

        return {
            "success": True,
            "count": len(interactions),
            "interactions": [
                {
                    "id": i.id,
                    "hcp": i.hcp.name if i.hcp else "Unknown",
                    "type": i.interaction_type,
                    "date": str(i.interaction_date),
                    "topics": (i.topics_discussed or "")[:100],
                    "sentiment": i.sentiment,
                    "outcomes": (i.outcomes or "")[:80],
                    "logged_via": i.logged_via,
                }
                for i in interactions
            ],
        }

    return get_interaction_history
