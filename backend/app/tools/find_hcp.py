"""
Tool: find_hcp
Searches the HCP database by name, specialty, institution, or territory.
Enables the agent to resolve HCP references from natural language and
surface profile information for context-aware interactions.
"""
from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession
from ..crud.hcp import get_all


def make_find_hcp_tool(db: AsyncSession):
    @tool
    async def find_hcp(
        query: str,
        territory: str | None = None,
        tier: str | None = None,
    ) -> dict:
        """
        Search for Healthcare Professionals by name, specialty, or institution.

        Returns matching HCP profiles including their specialty, institution,
        territory, and prescriber tier (A/B/C). Used to resolve HCP names from
        natural language descriptions and to surface profile context before
        logging or analyzing interactions.

        Args:
            query: Name or partial name of the HCP, specialty, or institution
            territory: Optional territory filter (e.g. "Northeast", "Southwest")
            tier: Optional prescriber tier filter (A, B, or C)
        """
        hcps = await get_all(db, search=query)

        if territory:
            hcps = [h for h in hcps if h.territory and territory.lower() in h.territory.lower()]
        if tier:
            hcps = [h for h in hcps if h.tier == tier.upper()]

        return {
            "success": True,
            "count": len(hcps),
            "hcps": [
                {
                    "id": h.id,
                    "name": h.name,
                    "specialty": h.specialty,
                    "institution": h.institution,
                    "territory": h.territory,
                    "tier": h.tier,
                    "email": h.email,
                }
                for h in hcps[:10]
            ],
        }

    return find_hcp
