from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/status")
async def auth_status():
    """Single-tenant mode — no authentication required."""
    return {"mode": "single-tenant", "auth_required": False}
