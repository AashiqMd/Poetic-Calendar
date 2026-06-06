import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "glowing"}

@patch("backend.main.gemini_client")
def test_generate_endpoint_happy_path(mock_gemini_client):
    # Mock the Gemini client and response
    mock_response = MagicMock()
    # Ensure text has backticks or not, just raw JSON that our code can parse
    mock_response.text = '{"poemLines": ["A joyful jump", "Under the sun"], "emotionTheme": "joy"}'
    
    mock_gemini_client.models.generate_content.return_value = mock_response

    payload = {
        "date": "July 4",
        "title": "Summer Picnic",
        "feeling": "Very happy",
        "description": "Ate a lot of watermelon."
    }

    response = client.post("/api/generate", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "poemLines" in data
    assert len(data["poemLines"]) == 2
    assert data["emotionTheme"] == "joy"

@patch("backend.main.gemini_client")
def test_generate_endpoint_invalid_emotion_fallback(mock_gemini_client):
    # Mock response with an invalid emotion
    mock_response = MagicMock()
    mock_response.text = '{"poemLines": ["Quiet times", "Are here"], "emotionTheme": "weird_emotion"}'
    
    mock_gemini_client.models.generate_content.return_value = mock_response

    payload = {
        "date": "Jan 1",
        "title": "New Year",
        "feeling": "Okay",
    }

    response = client.post("/api/generate", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    # Should fallback to DEFAULT_EMOTION "peace"
    assert data["emotionTheme"] == "peace"

def test_generate_endpoint_missing_fields():
    payload = {
        "date": "July 4"
        # missing title and feeling
    }
    response = client.post("/api/generate", json=payload)
    assert response.status_code == 422  # FastAPI Pydantic validation error
