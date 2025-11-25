from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Event, Rsvp, RsvpStatus
from app.schemas import (
    EventWithRsvpStats,
    EventOut,
    EventCreate,
    EventUpdate,
)

router = APIRouter(
    prefix="/api/events",
    tags=["Events"],
)


def _get_rsvp_stats(db: Session, event_id: int) -> Dict[str, int]:
    stats: Dict[str, int] = {"accepted": 0, "pending": 0, "declined": 0}

    rows = (
        db.query(Rsvp.status, func.count(Rsvp.id))
        .filter(Rsvp.event_id == event_id)
        .group_by(Rsvp.status)
        .all()
    )

    for status_value, count in rows:
        key = status_value.value if isinstance(status_value, RsvpStatus) else str(status_value)
        if key in stats:
            stats[key] = int(count)

    return stats


@router.get("/", response_model=List[EventWithRsvpStats])
def list_events(db: Session = Depends(get_db)) -> List[EventWithRsvpStats]:
    events: List[Event] = db.query(Event).all()
    result: List[EventWithRsvpStats] = []

    for event in events:
        s = _get_rsvp_stats(db, event.id)
        result.append(
            EventWithRsvpStats(
                id=event.id,
                name=event.name,
                description=event.description,
                date=event.date,
                time=event.time,
                location=event.location,
                status=event.status,
                created_by=event.created_by,
                created_at=event.created_at,
                updated_at=event.updated_at,
                rsvpAccepted=s["accepted"],
                rsvpPending=s["pending"],
                rsvpDeclined=s["declined"],
            )
        )

    return result


@router.get("/{event_id}", response_model=EventWithRsvpStats)
def get_event(event_id: int, db: Session = Depends(get_db)) -> EventWithRsvpStats:
    event: Event | None = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    s = _get_rsvp_stats(db, event.id)

    return EventWithRsvpStats(
        id=event.id,
        name=event.name,
        description=event.description,
        date=event.date,
        time=event.time,
        location=event.location,
        status=event.status,
        created_by=event.created_by,
        created_at=event.created_at,
        updated_at=event.updated_at,
        rsvpAccepted=s["accepted"],
        rsvpPending=s["pending"],
        rsvpDeclined=s["declined"],
    )


@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
) -> EventOut:
    new_event = Event(**event_in.dict())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    event_in: EventUpdate,
    db: Session = Depends(get_db),
) -> EventOut:
    event: Event | None = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    data = event_in.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)) -> None:
    event: Event | None = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    db.delete(event)
    db.commit()
