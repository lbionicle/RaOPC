from fastapi import status
from fastapi.testclient import TestClient


def create_user_for_rsvp(client: TestClient) -> int:
    payload = {
        "name": "RSVP User",
        "email": "rsvp@example.com",
        "role": "attendee",
        "status": "active",
    }
    response = client.post("/api/admin/users", json=payload)

    if response.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    ):
        return response.json()["id"]

    assert response.status_code == status.HTTP_400_BAD_REQUEST

    list_resp = client.get("/api/admin/users")
    assert list_resp.status_code == status.HTTP_200_OK

    users = list_resp.json()
    for user in users:
        if user.get("email") == payload["email"]:
            return user["id"]

    raise AssertionError("Не удалось получить id пользователя для теста create_user_for_rsvp")


def create_event_for_rsvp(client: TestClient, user_id: int) -> int:
    payload = {
        "name": "RSVP Event",
        "description": "Событие для проверки RSVP",
        "date": "2025-07-01",
        "time": "14:00:00",
        "location": "Минск, зал D",
        "status": "active",
        "created_by": user_id,
    }
    response = client.post("/api/events", json=payload)
    assert response.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )
    return response.json()["id"]


def test_set_rsvp_and_list(client: TestClient) -> None:
    user_id = create_user_for_rsvp(client)
    event_id = create_event_for_rsvp(client, user_id)

    payload = {
        "user_id": user_id,
        "status": "accepted",
    }

    response_set = client.post(f"/api/events/{event_id}/rsvp", json=payload)
    assert response_set.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )

    data = response_set.json()
    assert data["event_id"] == event_id
    assert data["user_id"] == user_id
    assert data["status"] == "accepted"
    assert data["responded_at"] is not None

    response_list = client.get(f"/api/events/{event_id}/rsvp")
    assert response_list.status_code == status.HTTP_200_OK

    rsvps = response_list.json()
    assert isinstance(rsvps, list)
    assert len(rsvps) == 1
    r = rsvps[0]
    assert r["event_id"] == event_id
    assert r["user_id"] == user_id
    assert r["status"] == "accepted"


def test_rsvp_stats_in_events_list(client: TestClient) -> None:
    user1 = create_user_for_rsvp(client)
    user2 = create_user_for_rsvp(client)
    user3 = create_user_for_rsvp(client)

    event_id = create_event_for_rsvp(client, user1)

    client.post(f"/api/events/{event_id}/rsvp", json={"user_id": user1, "status": "accepted"})
    client.post(f"/api/events/{event_id}/rsvp", json={"user_id": user2, "status": "pending"})
    client.post(f"/api/events/{event_id}/rsvp", json={"user_id": user3, "status": "declined"})

    response_events = client.get("/api/events")
    assert response_events.status_code == status.HTTP_200_OK

    events = response_events.json()
    target = next(e for e in events if e["id"] == event_id)

    keys = target.keys()
    accepted_key = next(k for k in keys if "accepted" in k.lower())
    pending_key = next(k for k in keys if "pending" in k.lower())
    declined_key = next(k for k in keys if "declined" in k.lower())

    assert target[accepted_key] == 1
    assert target[pending_key] == 1
    assert target[declined_key] == 1
