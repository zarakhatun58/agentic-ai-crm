from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class HCPBase(BaseModel):
    name: str
    specialty: str | None = None
    institution: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    territory: str | None = None
    tier: str = "B"


class HCPCreate(HCPBase):
    pass


class HCPUpdate(BaseModel):
    name: str | None = None
    specialty: str | None = None
    institution: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    territory: str | None = None
    tier: str | None = None


class HCPResponse(HCPBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)