from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .core.config import settings
from .core.database import Base, engine
from .routers import (
    auth,
    chat,
    hcp,
    interaction,
    health,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """

    # Create database tables (development/demo)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Verify database connection
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))

    print("✅ Database connected successfully.")
    print(f"✅ AI Model: {settings.groq_model}")

    yield

    await engine.dispose()
    print("🛑 Database connection closed.")


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="""
AI-First CRM — Healthcare Professional Module

Features

• HCP Management
• AI Chat Interface
• Log Interaction
• Edit Interaction
• Interaction History
• AI Follow-up Suggestions
• LangGraph Agent
• Groq LLM (gemma2-9b-it)
• PostgreSQL Database
""",
    lifespan=lifespan,
)

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# API Routes
# -----------------------------

app.include_router(health.router)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(hcp.router, prefix="/api/v1")
app.include_router(interaction.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")


# -----------------------------
# Root Endpoint
# -----------------------------

@app.get("/", tags=["Root"])
async def root():
    return {
        "application": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "database": "PostgreSQL",
        "ai_framework": "LangGraph",
        "llm": settings.groq_model,
        "docs": "/docs",
        "redoc": "/redoc",
    }