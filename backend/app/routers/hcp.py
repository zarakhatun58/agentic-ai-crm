from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..crud import hcp as crud
from ..schemas.hcp import HCPCreate, HCPUpdate, HCPResponse

router = APIRouter(prefix="/hcps", tags=["HCPs"])


@router.get("/", response_model=list[HCPResponse])
async def list_hcps(search: str | None = None, db: AsyncSession = Depends(get_db)):
    return await crud.get_all(db, search=search)


@router.get("/{hcp_id}", response_model=HCPResponse)
async def get_hcp(hcp_id: str, db: AsyncSession = Depends(get_db)):
    hcp = await crud.get_by_id(db, hcp_id)
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    return hcp


@router.post("/", response_model=HCPResponse, status_code=201)
async def create_hcp(data: HCPCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create(db, data)


@router.patch("/{hcp_id}", response_model=HCPResponse)
async def update_hcp(hcp_id: str, data: HCPUpdate, db: AsyncSession = Depends(get_db)):
    hcp = await crud.update(db, hcp_id, data)
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    return hcp


@router.delete("/{hcp_id}", status_code=204)
async def delete_hcp(hcp_id: str, db: AsyncSession = Depends(get_db)):
    deleted = await crud.delete(db, hcp_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="HCP not found")
