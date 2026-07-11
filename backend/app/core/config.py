"""
Application configuration.

Loads environment variables from the .env file using Pydantic Settings.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
    )

    # ----------------------------
    # App
    # ----------------------------

    app_name: str = "AI-First CRM - HCP Module"
    app_version: str = "1.0.0"
    debug: bool = False

    # ----------------------------
    # Database
    # ----------------------------

    database_url: str = Field(...)

    # ----------------------------
    # Groq
    # ----------------------------

    groq_api_key: str = Field(...)

    groq_model: str = "llama-3.3-70b-versatile"

    groq_model_large: str = "llama-3.3-70b-versatile"

    # ----------------------------
    # Security
    # ----------------------------

    secret_key: str = Field(...)

    algorithm: str = "HS256"

    access_token_expire_minutes: int = 60 * 24


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()


settings = get_settings()