from fastapi import status
from fastapi.testclient import TestClient


def test_create_and_get_user(client: TestClient) -> None:
    payload = {
        "name": "Test User",
        "email": "user@example.com",
        "role": "admin",
        "status": "active",
    }

    response = client.post("/api/admin/users", json=payload)
    assert response.status_code in (
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    )

    data = response.json()
    assert "id" in data
    user_id = data["id"]

    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["role"] == payload["role"]
    assert data["status"] == payload["status"]

    response_get = client.get(f"/api/admin/users/{user_id}")
    assert response_get.status_code == status.HTTP_200_OK
    data_get = response_get.json()
    assert data_get["id"] == user_id


def test_list_users_returns_array(client: TestClient) -> None:
    payload = {
        "name": "Second User",
        "email": "second@example.com",
        "role": "coordinator",
        "status": "active",
    }
    client.post("/api/admin/users", json=payload)

    response = client.get("/api/admin/users")
    assert response.status_code == status.HTTP_200_OK

    users = response.json()
    assert isinstance(users, list)
    assert len(users) >= 1

    first = users[0]
    assert "id" in first
    assert "name" in first
    assert "email" in first
    assert "role" in first
    assert "status" in first


def test_update_user(client: TestClient) -> None:
    payload = {
        "name": "To Update",
        "email": "update@example.com",
        "role": "attendee",
        "status": "active",
    }
    response_create = client.post("/api/admin/users", json=payload)
    user_id = response_create.json()["id"]

    update_payload = {
        "name": "Updated Name",
        "email": "update@example.com",
        "role": "coordinator",
        "status": "blocked",
    }

    response_update = client.put(
        f"/api/admin/users/{user_id}",
        json=update_payload,
    )
    assert response_update.status_code == status.HTTP_200_OK
    data = response_update.json()
    assert data["id"] == user_id
    assert data["name"] == update_payload["name"]
    assert data["role"] == update_payload["role"]
    assert data["status"] == update_payload["status"]


def test_delete_user(client: TestClient) -> None:
    payload = {
        "name": "To Delete",
        "email": "delete@example.com",
        "role": "attendee",
        "status": "active",
    }
    response_create = client.post("/api/admin/users", json=payload)
    user_id = response_create.json()["id"]

    response_delete = client.delete(f"/api/admin/users/{user_id}")
    assert response_delete.status_code in (
        status.HTTP_200_OK,
        status.HTTP_204_NO_CONTENT,
    )

    response_get = client.get(f"/api/admin/users/{user_id}")
    assert response_get.status_code == status.HTTP_404_NOT_FOUND
