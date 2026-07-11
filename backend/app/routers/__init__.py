from .auth import router as auth_router
from .chat import router as chat_router
from .hcp import router as hcp_router
from .interaction import router as interaction_router
from .health import router as health_router

__all__ = [
    "auth_router",
    "chat_router",
    "hcp_router",
    "interaction_router",
    "health_router",
]