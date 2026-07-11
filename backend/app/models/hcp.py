import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base


class HCP(Base):
    __tablename__ = "hcps"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    specialty: Mapped[str | None] = mapped_column(String)
    institution: Mapped[str | None] = mapped_column(String)
    email: Mapped[str | None] = mapped_column(String)
    phone: Mapped[str | None] = mapped_column(String)
    territory: Mapped[str | None] = mapped_column(String)
    tier: Mapped[str | None] = mapped_column(String, default="B")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    interactions: Mapped[list["Interaction"]] = relationship(  # noqa: F821
        "Interaction", back_populates="hcp", cascade="all, delete-orphan"
    )
