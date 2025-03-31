import requests

BASE_URL = "http://localhost:8000"

def test_home():
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_create_item():
    payload = {"name": "test", "description": "testing"}
    response = requests.post(f"{BASE_URL}/items/", json=payload)
    assert response.status_code == 200
    assert response.json()["name"] == "test"
