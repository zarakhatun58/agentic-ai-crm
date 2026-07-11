import json
import httpx
from ..core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


async def chat_completion(
    messages: list[dict],
    tools: list[dict] | None = None,
    tool_choice: str = "auto",
    temperature: float = 0.3,
    max_tokens: int = 1024,
    use_large_model: bool = False,
) -> dict:
    model = settings.groq_model_large if use_large_model else settings.groq_model

    payload: dict = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if tools:
        payload["tools"] = tools
        payload["tool_choice"] = tool_choice

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        return response.json()


async def extract_json(raw: str) -> dict:
    """Extract first JSON object from a string (handles markdown code blocks)."""
    import re

    match = re.search(r"\{[\s\S]*\}", raw)
    if not match:
        return {}
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return {}


async def extract_json_array(raw: str) -> list:
    """Extract first JSON array from a string."""
    import re

    match = re.search(r"\[[\s\S]*\]", raw)
    if not match:
        return []
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return []
