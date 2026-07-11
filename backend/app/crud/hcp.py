from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..models.hcp import HCP
from ..schemas.hcp import HCPCreate, HCPUpdate


async def get_all(db: AsyncSession, search: str | None = None) -> list[HCP]:
    stmt = select(HCP).order_by(HCP.name)
    if search:
        stmt = stmt.where(
            or_(
                HCP.name.ilike(f"%{search}%"),
                HCP.specialty.ilike(f"%{search}%"),
                HCP.institution.ilike(f"%{search}%"),
            )
        )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_by_id(db: AsyncSession, hcp_id: str) -> HCP | None:
    result = await db.execute(select(HCP).where(HCP.id == hcp_id))
    return result.scalar_one_or_none()


async def create(db: AsyncSession, data: HCPCreate) -> HCP:
    hcp = HCP(**data.model_dump())
    db.add(hcp)
    await db.commit()
    await db.refresh(hcp)
    return hcp


async def update(db: AsyncSession, hcp_id: str, data: HCPUpdate) -> HCP | None:
    hcp = await get_by_id(db, hcp_id)
    if not hcp:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(hcp, field, value)
    await db.commit()
    await db.refresh(hcp)
    return hcp


async def delete(db: AsyncSession, hcp_id: str) -> bool:
    hcp = await get_by_id(db, hcp_id)
    if not hcp:
        return False
    await db.delete(hcp)
    await db.commit()
    return True

async def search_by_name(
    db: AsyncSession,
    name: str,
) -> list[HCP]:
    stmt = (
        select(HCP)
        .where(HCP.name.ilike(f"%{name}%"))
        .order_by(HCP.name)
    )

    result = await db.execute(stmt)

    return list(result.scalars())

async def get_by_name(
    db: AsyncSession,
    name: str,
) -> HCP | None:
    stmt = (
        select(HCP)
        .where(HCP.name.ilike(name))
    )

    result = await db.execute(stmt)

    return result.scalar_one_or_none()
async def exists(
    db: AsyncSession,
    hcp_id: str,
) -> bool:
    return await get_by_id(db, hcp_id) is not None
