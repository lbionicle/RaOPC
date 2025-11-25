from datetime import date, time, datetime, timezone
from enum import Enum
from typing import Optional

from sqlalchemy import (
    String,
    Text,
    Date,
    Time,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, Enum):
    admin = "admin"
    coordinator = "coordinator"
    reception = "reception"
    attendee = "attendee"


class UserStatus(str, Enum):
    active = "active"
    blocked = "blocked"


class EventStatus(str, Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class RsvpStatus(str, Enum):
    accepted = "accepted"
    pending = "pending"
    declined = "declined"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole),
        nullable=False,
        default=UserRole.coordinator,
    )
    status: Mapped[UserStatus] = mapped_column(
        SqlEnum(UserStatus),
        nullable=False,
        default=UserStatus.active,
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    events: Mapped[list["Event"]] = relationship(
        back_populates="creator",
        cascade="all, delete-orphan",
    )
    rsvps: Mapped[list["Rsvp"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[time] = mapped_column(Time, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[EventStatus] = mapped_column(
        SqlEnum(EventStatus),
        default=EventStatus.active,
        nullable=False,
    )
    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    creator: Mapped["User"] = relationship(back_populates="events")
    rsvps: Mapped[list["Rsvp"]] = relationship(
        back_populates="event",
        cascade="all, delete-orphan",
    )


class Rsvp(Base):
    __tablename__ = "rsvps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )
    status: Mapped[RsvpStatus] = mapped_column(
        SqlEnum(RsvpStatus),
        default=RsvpStatus.pending,
        nullable=False,
    )
    responded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        nullable=False,
    )

    event: Mapped["Event"] = relationship(back_populates="rsvps")
    user: Mapped["User"] = relationship(back_populates="rsvps")
