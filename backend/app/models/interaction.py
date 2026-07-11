import uuid
from datetime import datetime, date, time
from typing import Any
from sqlalchemy import String, DateTime, Date, Time, Text, ARRAY, JSON, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hcp_id: Mapped[str | None] = mapped_column(String, ForeignKey("hcps.id", ondelete="CASCADE"))
    interaction_type: Mapped[str] = mapped_column(String, nullable=False, default="Meeting")
    interaction_date: Mapped[date] = mapped_column(Date, nullable=False)
    interaction_time: Mapped[time | None] = mapped_column(Time)
    attendees: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    topics_discussed: Mapped[str | None] = mapped_column(Text)
    sentiment: Mapped[str] = mapped_column(String, default="neutral")
    outcomes: Mapped[str | None] = mapped_column(Text)
    follow_up_actions: Mapped[str | None] = mapped_column(Text)
    ai_summary: Mapped[str | None] = mapped_column(Text)
    ai_suggested_follow_ups: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    logged_via: Mapped[str] = mapped_column(String, default="form")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    hcp: Mapped["HCP"] = relationship("HCP", back_populates="interactions")  # noqa: F821
    materials: Mapped[list["InteractionMaterial"]] = relationship(  # noqa: F821
        "InteractionMaterial", back_populates="interaction", cascade="all, delete-orphan"
    )
    samples: Mapped[list["InteractionSample"]] = relationship(  # noqa: F821
        "InteractionSample", back_populates="interaction", cascade="all, delete-orphan"
    )


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str | None] = mapped_column(String, default="Brochure")
    product: Mapped[str | None] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Sample(Base):
    __tablename__ = "samples"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    product: Mapped[str | None] = mapped_column(String)
    dosage: Mapped[str | None] = mapped_column(String)
    unit: Mapped[str | None] = mapped_column(String, default="tablets")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class InteractionMaterial(Base):
    __tablename__ = "interaction_materials"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interaction_id: Mapped[str] = mapped_column(String, ForeignKey("interactions.id", ondelete="CASCADE"))
    material_id: Mapped[str] = mapped_column(String, ForeignKey("materials.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    interaction: Mapped["Interaction"] = relationship("Interaction", back_populates="materials")


class InteractionSample(Base):
    __tablename__ = "interaction_samples"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interaction_id: Mapped[str] = mapped_column(String, ForeignKey("interactions.id", ondelete="CASCADE"))
    sample_id: Mapped[str] = mapped_column(String, ForeignKey("samples.id", ondelete="CASCADE"))
    quantity: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    interaction: Mapped["Interaction"] = relationship("Interaction", back_populates="samples")
