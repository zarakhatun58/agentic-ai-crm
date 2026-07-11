"""
Tool: edit_interaction
Allows field reps to modify previously logged interaction data.
Supports partial updates — only the specified fields are changed.
"""
from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession
from ..crud.interaction import get_by_id, update
from ..schemas.interaction import InteractionUpdate


def make_edit_interaction_tool(db: AsyncSession):
    @tool
    async def edit_interaction(interaction_id: str, updates: dict) -> dict:
        """
        Edit or update an existing logged HCP interaction.

        Allows modification of: topics_discussed, sentiment, outcomes,
        follow_up_actions, interaction_type, and interaction_date.
        Only the fields present in `updates` are modified; other fields
        remain unchanged (partial update).

        Args:
            interaction_id: UUID of the interaction to edit
            updates: Dict of fields to update (subset of the interaction schema)
        """
        allowed_fields = {
            "topics_discussed",
            "sentiment",
            "outcomes",
            "follow_up_actions",
            "interaction_type",
            "interaction_date",
            "attendees",
            "ai_summary",
            "ai_suggested_follow_ups",
        }
        clean = {k: v for k, v in updates.items() if k in allowed_fields}

        interaction = await update(db, interaction_id, InteractionUpdate(**clean))
        if not interaction:
            return {"success": False, "error": f"Interaction {interaction_id} not found"}

        return {
            "success": True,
            "interaction_id": interaction.id,
            "updated_fields": list(clean.keys()),
            "message": f"Interaction {interaction_id} updated successfully",
        }

    return edit_interaction
