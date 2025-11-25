from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Event, Rsvp
from app.schemas import RsvpOut, RsvpCreate

router = APIRouter(
    prefix="/api/events/{event_id}/rsvp",
    tags=["RSVP"],
)


@router.post("/", response_model=RsvpOut)
def set_rsvp(
    event_id: int,
    rsvp_in: RsvpCreate,
    db: Session = Depends(get_db),
) -> RsvpOut:
    event: Event | None = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    rsvp: Rsvp | None = (
        db.query(Rsvp)
        .filter(
            Rsvp.event_id == event_id,
            Rsvp.user_id == rsvp_in.user_id,
        )
        .first()
    )

    if rsvp is None:
        rsvp = Rsvp(
            event_id=event_id,
            user_id=rsvp_in.user_id,
            status=rsvp_in.status,
        )
        db.add(rsvp)
    else:
        rsvp.status = rsvp_in.status
        rsvp.responded_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(rsvp)
    return rsvp


@router.get("/", response_model=List[RsvpOut])
def list_rsvp(
    event_id: int,
    db: Session = Depends(get_db),
) -> List[Rsvp]:
    event: Event | None = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    rsvps: List[Rsvp] = db.query(Rsvp).filter(Rsvp.event_id == event_id).all()
    return rsvps
