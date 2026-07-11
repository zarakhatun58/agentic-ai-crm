from fastapi import APIRouter

router = APIRouter(
    tags=["Health"],
)


@router.get("/health")
async def health():
    """
    Health check endpoint.

    Used by:
    - Docker
    - Render
    - Railway
    - Kubernetes
    - Load Balancers
    - Monitoring Tools
    """

    return {
        "status": "healthy",
        "service": "AI-First CRM Backend",
        "version": "1.0.0",
    }