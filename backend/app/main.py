from fastapi import FastAPI

from app.database import Base, engine
from app.routers.events import router as events_router
from app.routers.users import router as users_router
from app.routers.rsvp import router as rsvp_router


app = FastAPI(
    title="Planora API",
    description="API для управления корпоративными мероприятиями с RSVP",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(events_router)
app.include_router(users_router)
app.include_router(rsvp_router)
