from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from ..crud import hcp as crud_hcp
from ..crud import interaction as crud_interaction
from ..schemas.interaction import InteractionCreate
from .groq_service import chat_completion, extract_json


async def create_from_description(
    db: AsyncSession,
    raw_description: str,
    hcp_id: str | None = None,
    context_hcps: list[dict] | None = None,
) -> dict:
    """
    Extract structured interaction data from natural language,
    save the interaction,
    generate AI summary,
    generate AI follow-up suggestions.
    """

    today = date.today().isoformat()

    extraction_prompt = f"""
You are an AI CRM assistant for pharmaceutical field representatives.

Extract structured information from the conversation.

Return ONLY valid JSON.

{{
    "hcp_name": null,
    "interaction_type": "Meeting",
    "interaction_date": "{today}",
    "topics_discussed": "",
    "sentiment": "neutral",
    "outcomes": "",
    "follow_up_actions": "",
    "summary": "",
    "suggested_follow_ups": []
}}

User Message:
{raw_description}
"""

    # -------------------------
    # Ask Groq
    # -------------------------

    result = await chat_completion(
        messages=[
            {
                "role": "user",
                "content": extraction_prompt,
            }
        ],
        temperature=0.2,
        max_tokens=512,
    )

    raw = result["choices"][0]["message"]["content"]

    extracted = await extract_json(raw)

    # -------------------------
    # AI Outputs
    # -------------------------

    ai_summary = extracted.get("summary", "")

    suggested_follow_ups = extracted.get(
        "suggested_follow_ups",
        [],
    )

    # -------------------------
    # Resolve HCP
    # -------------------------

    resolved_hcp_id = hcp_id

    if (
        not resolved_hcp_id
        and extracted.get("hcp_name")
        and context_hcps
    ):
        name = extracted["hcp_name"].lower()

        match = next(
            (
                h
                for h in context_hcps
                if name in h["name"].lower()
            ),
            None,
        )

        if match:
            resolved_hcp_id = match["id"]

    elif (
        not resolved_hcp_id
        and extracted.get("hcp_name")
    ):
        hcps = await crud_hcp.get_all(
            db,
            search=extracted["hcp_name"],
        )

        if hcps:
            resolved_hcp_id = hcps[0].id

    # -------------------------
    # Create Interaction
    # -------------------------

    interaction_data = InteractionCreate(
        hcp_id=resolved_hcp_id,
        interaction_type=extracted.get(
            "interaction_type",
            "Meeting",
        ),
        interaction_date=extracted.get(
            "interaction_date",
            today,
        ),
        topics_discussed=extracted.get(
            "topics_discussed",
            raw_description,
        ),
        sentiment=extracted.get(
            "sentiment",
            "neutral",
        ),
        outcomes=extracted.get(
            "outcomes",
        ),
        follow_up_actions=extracted.get(
            "follow_up_actions",
        ),
        logged_via="chat",

        # NEW
        ai_summary=ai_summary,
        ai_suggested_follow_ups=suggested_follow_ups,
    )

    interaction = await crud_interaction.create(
        db,
        interaction_data,
    )

    # -------------------------
    # Form Data
    # -------------------------

    form_data = {
        "hcp_id": resolved_hcp_id or "",
        "interaction_type": interaction.interaction_type,
        "interaction_date": str(interaction.interaction_date),
        "topics_discussed": interaction.topics_discussed or "",
        "sentiment": interaction.sentiment,
        "outcomes": interaction.outcomes or "",
        "follow_up_actions": interaction.follow_up_actions or "",
    }

    # -------------------------
    # Response
    # -------------------------

    return {
        "interaction": interaction,
        "interaction_id": interaction.id,
        "form_data": form_data,
        "ai_summary": interaction.ai_summary,
        "suggested_follow_ups": interaction.ai_suggested_follow_ups,
    }