from fastapi import status
from fastapi.testclient import TestClient


def create_test_user(client: TestClient) -> int:
    payload = {
        "name": "Event Owner",
        "email": "owner@example.com",
        "role": "coordinator",
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

    raise AssertionError("Не удалось получить id пользователя для теста create_test_user")


def test_create_and_get_event(client: TestClient) -> None:
    user_id = create_test_user(client)

    payload = {
        "name": "Test Event",
        "description": "Описание тестового события",
        "date": "2025-12-31",
        "time": "18:00:00",
        "location": "Минск, зал А",
        "status": "active",
        "created_by": user_id,
    }

    response = client.post("/api/events", json=payload)
    assert response.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )

    data = response.json()
    assert "id" in data
    event_id = data["id"]
    assert data["name"] == payload["name"]
    assert data["location"] == payload["location"]

    response_get = client.get(f"/api/events/{event_id}")
    assert response_get.status_code == status.HTTP_200_OK
    data_get = response_get.json()
    assert data_get["id"] == event_id
    assert data_get["name"] == payload["name"]


def test_list_events_returns_array(client: TestClient) -> None:
    user_id = create_test_user(client)

    payload = {
        "name": "List Event",
        "description": "Для проверки списка",
        "date": "2025-01-10",
        "time": "10:30:00",
        "location": "Переговорка B",
        "status": "active",
        "created_by": user_id,
    }
    client.post("/api/events", json=payload)

    response = client.get("/api/events")
    assert response.status_code == status.HTTP_200_OK

    events = response.json()
    assert isinstance(events, list)
    assert len(events) >= 1

    first = events[0]
    assert "id" in first
    assert "name" in first
    assert "date" in first
    assert "time" in first
    assert "location" in first

    stats_keys = {k for k in first.keys() if "rsvp" in k.lower()}
    assert stats_keys


def test_update_event(client: TestClient) -> None:
    user_id = create_test_user(client)

    payload = {
        "name": "Old Name",
        "description": "Старое описание",
        "date": "2025-05-05",
        "time": "12:00:00",
        "location": "Переговорка C",
        "status": "draft",
        "created_by": user_id,
    }
    response_create = client.post("/api/events", json=payload)
    assert response_create.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )
    event_id = response_create.json()["id"]

    update_payload = {
        "name": "New Name",
        "description": "Новое описание",
        "status": "active",
    }

    response_update = client.put(
        f"/api/events/{event_id}",
        json=update_payload,
    )
    assert response_update.status_code == status.HTTP_200_OK
    data = response_update.json()
    assert data["id"] == event_id
    assert data["name"] == update_payload["name"]
    assert data["description"] == update_payload["description"]
    assert data["status"] == update_payload["status"]


def test_delete_event(client: TestClient) -> None:
    user_id = create_test_user(client)

    payload = {
        "name": "To Delete Event",
        "description": "Событие под удаление",
        "date": "2025-06-01",
        "time": "09:00:00",
        "location": "Минск, зал C",
        "status": "active",
        "created_by": user_id,
    }
    response_create = client.post("/api/events", json=payload)
    assert response_create.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )
    event_id = response_create.json()["id"]

    response_delete = client.delete(f"/api/events/{event_id}")
    assert response_delete.status_code in (
        status.HTTP_200_OK,
        status.HTTP_204_NO_CONTENT,
    )

    response_get = client.get(f"/api/events/{event_id}")
    assert response_get.status_code == status.HTTP_404_NOT_FOUND
