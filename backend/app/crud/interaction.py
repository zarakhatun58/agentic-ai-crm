from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models.interaction import Interaction
from ..schemas.interaction import InteractionCreate, InteractionUpdate


async def get_all(
    db: AsyncSession,
    hcp_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[Interaction]:

    stmt = (
        select(Interaction)
        .options(selectinload(Interaction.hcp))
        .order_by(
            Interaction.interaction_date.desc(),
            Interaction.created_at.desc(),
        )
        .limit(limit)
        .offset(offset)
    )

    if hcp_id:
        stmt = stmt.where(
            Interaction.hcp_id == hcp_id
        )

    result = await db.execute(stmt)

    return list(result.scalars().all())


async def get_by_id(
    db: AsyncSession,
    interaction_id: str,
) -> Interaction | None:

    result = await db.execute(
        select(Interaction)
        .options(selectinload(Interaction.hcp))
        .where(
            Interaction.id == interaction_id
        )
    )

    return result.scalar_one_or_none()


async def create(
    db: AsyncSession,
    data: InteractionCreate,
) -> Interaction:
    """
    Create a new interaction.

    Supports AI-generated fields:
    - ai_summary
    - ai_suggested_follow_ups
    """

    interaction = Interaction(
        **data.model_dump()
    )

    db.add(interaction)

    await db.commit()

    await db.refresh(interaction)

    return interaction


async def update(
    db: AsyncSession,
    interaction_id: str,
    data: InteractionUpdate,
) -> Interaction | None:

    interaction = await get_by_id(
        db,
        interaction_id,
    )

    if interaction is None:
        return None

    for field, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(interaction, field, value)

    await db.commit()

    await db.refresh(interaction)

    return interaction


async def delete(
    db: AsyncSession,
    interaction_id: str,
) -> bool:

    interaction = await get_by_id(
        db,
        interaction_id,
    )

    if interaction is None:
        return False

    await db.delete(interaction)

    await db.commit()

    return True


async def get_latest(
    db: AsyncSession,
    hcp_id: str,
) -> Interaction | None:

    stmt = (
        select(Interaction)
        .where(
            Interaction.hcp_id == hcp_id
        )
        .order_by(
            Interaction.interaction_date.desc()
        )
        .limit(1)
    )

    result = await db.execute(stmt)

    return result.scalar_one_or_none()


async def get_recent_history(
    db: AsyncSession,
    hcp_id: str,
    limit: int = 5,
) -> list[Interaction]:

    stmt = (
        select(Interaction)
        .where(
            Interaction.hcp_id == hcp_id
        )
        .order_by(
            Interaction.interaction_date.desc()
        )
        .limit(limit)
    )

    result = await db.execute(stmt)

    return list(result.scalars().all())


async def get_by_date(
    db: AsyncSession,
    interaction_date: date,
) -> list[Interaction]:

    stmt = (
        select(Interaction)
        .where(
            Interaction.interaction_date == interaction_date
        )
        .options(
            selectinload(Interaction.hcp)
        )
        .order_by(
            Interaction.created_at.desc()
        )
    )

    result = await db.execute(stmt)

    return list(result.scalars().all())