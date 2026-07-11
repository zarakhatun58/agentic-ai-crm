from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..crud import interaction as crud
from ..schemas.interaction import (
    InteractionCreate,
    InteractionUpdate,
    InteractionResponse,
)

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.get("/", response_model=list[InteractionResponse])
async def list_interactions(
    hcp_id: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_all(db, hcp_id=hcp_id, limit=limit, offset=offset)


@router.get("/{interaction_id}", response_model=InteractionResponse)
async def get_interaction(
    interaction_id: str,
    db: AsyncSession = Depends(get_db),
):
    interaction = await crud.get_by_id(db, interaction_id)

    if not interaction:
        raise HTTPException(
            status_code=404,
            detail="Interaction not found",
        )

    return interaction

@router.post("/", response_model=InteractionResponse, status_code=201)
async def create_interaction(
    data: InteractionCreate,
    db: AsyncSession = Depends(get_db),
):
    # Convert "" -> None
    if data.hcp_id == "":
        data.hcp_id = None

    return await crud.create(db, data)

@router.patch("/{interaction_id}", response_model=InteractionResponse)
async def update_interaction(
    interaction_id: str,
    data: InteractionUpdate,
    db: AsyncSession = Depends(get_db),
):
    # Convert "" -> None
    if hasattr(data, "hcp_id") and data.hcp_id == "":
        data.hcp_id = None

    interaction = await crud.update(db, interaction_id, data)

    if not interaction:
        raise HTTPException(
            status_code=404,
            detail="Interaction not found",
        )

    return interaction


@router.delete("/{interaction_id}", status_code=204)
async def delete_interaction(
    interaction_id: str,
    db: AsyncSession = Depends(get_db),
):
    deleted = await crud.delete(db, interaction_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Interaction not found",
        )