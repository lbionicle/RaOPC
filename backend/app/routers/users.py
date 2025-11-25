from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Event
from app.schemas import (
    UserWithStats,
    UserOut,
    UserCreate,
    UserUpdate,
)

router = APIRouter(
    prefix="/api/admin/users",
    tags=["Users"],
)


def _get_events_count_for_user(db: Session, user_id: int) -> int:
    return int(db.query(Event).filter(Event.created_by == user_id).count())


@router.get("/", response_model=List[UserWithStats])
def list_users(db: Session = Depends(get_db)) -> List[UserWithStats]:
    users: List[User] = db.query(User).all()
    result: List[UserWithStats] = []

    for user in users:
        events_count = _get_events_count_for_user(db, user.id)
        user_data = UserOut.from_orm(user)
        result.append(
            UserWithStats(
                **user_data.dict(),
                eventsCount=events_count,
            )
        )

    return result


@router.get("/{user_id}", response_model=UserWithStats)
def get_user(user_id: int, db: Session = Depends(get_db)) -> UserWithStats:
    user: User | None = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    events_count = _get_events_count_for_user(db, user.id)
    user_data = UserOut.from_orm(user)
    return UserWithStats(
        **user_data.dict(),
        eventsCount=events_count,
    )


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
) -> UserOut:
    existing: User | None = db.query(User).filter(User.email == user_in.email).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    user = User(**user_in.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
) -> UserOut:
    user: User | None = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    data = user_in.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)) -> None:
    user: User | None = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    db.delete(user)
    db.commit()
