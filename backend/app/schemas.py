from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import UserRole, UserStatus, EventStatus, RsvpStatus

_base_config = ConfigDict(
    from_attributes=True,
    use_enum_values=True,
)


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    status: UserStatus = UserStatus.active

    model_config = _base_config


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None

    model_config = _base_config


class UserOut(UserBase):
    id: int
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class UserWithStats(UserOut):
    eventsCount: int


class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: date
    time: time
    location: str
    status: EventStatus = EventStatus.active

    model_config = _base_config


class EventCreate(EventBase):
    created_by: int


class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    time: Optional[time] = None
    location: Optional[str] = None
    status: Optional[EventStatus] = None

    model_config = _base_config


class EventOut(EventBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime


class EventWithRsvpStats(EventOut):
    rsvpAccepted: int
    rsvpPending: int
    rsvpDeclined: int


class RsvpBase(BaseModel):
    status: RsvpStatus

    model_config = _base_config


class RsvpCreate(RsvpBase):
    user_id: int


class RsvpOut(RsvpBase):
    id: int
    event_id: int
    user_id: int
    responded_at: datetime
