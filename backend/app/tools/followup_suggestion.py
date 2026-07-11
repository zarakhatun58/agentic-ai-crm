"""
Tool: suggest_follow_ups
Generates AI-powered follow-up action suggestions based on interaction context,
HCP profile, and historical patterns. Uses Groq LLM to produce specific,
actionable recommendations tailored to life science field sales.
"""
from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession
from ..crud.hcp import get_by_id
from ..services.groq_service import chat_completion, extract_json_array


def make_suggest_follow_ups_tool(db: AsyncSession):
    @tool
    async def suggest_follow_ups(
        interaction_context: str,
        hcp_id: str | None = None,
    ) -> dict:
        """
        Generate AI-powered follow-up action suggestions for an HCP interaction.

        Produces 4 specific, actionable follow-up recommendations tailored to
        the interaction context and HCP profile. Considers the HCP's specialty,
        tier, and the nature of the discussion to provide relevant suggestions
        (e.g., send specific clinical data, schedule advisory board invitation,
        arrange sample replenishment, plan territory manager joint call).

        Args:
            interaction_context: Description of the interaction or key topics discussed
            hcp_id: Optional HCP UUID for personalized suggestions based on profile
        """
        hcp_context = ""
        if hcp_id:
            hcp = await get_by_id(db, hcp_id)
            if hcp:
                hcp_context = (
                    f"HCP Profile: {hcp.name}, {hcp.specialty} at {hcp.institution}. "
                    f"Territory: {hcp.territory}. Tier: {hcp.tier}."
                )

        prompt = f"""You are an expert life science pharmaceutical sales coach.
Generate exactly 4 specific, actionable follow-up actions for a field representative.
{hcp_context}
Interaction context: "{interaction_context}"

Return a JSON array of 4 strings — each should be a concise, specific action.
Examples: ["Send OncoBoost Phase III PDF within 48 hours", "Schedule follow-up meeting for 2 weeks"]
Respond ONLY with a valid JSON array, no markdown, no explanation."""

        result = await chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=300,
        )
        raw = result["choices"][0]["message"]["content"]
        suggestions = await extract_json_array(raw)

        if not suggestions:
            suggestions = [
                "Schedule a follow-up meeting within 2 weeks",
                "Send relevant clinical data or product information",
                "Submit sample request if applicable",
                "Log any changes in prescribing behavior",
            ]

        return {
            "success": True,
            "suggested_follow_ups": suggestions[:5],
            "message": f"Generated {len(suggestions[:5])} follow-up suggestions",
        }

    return suggest_follow_ups
