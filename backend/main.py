"""Poetic Year — FastAPI Backend."""

import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Optional, List

try:
    from prompts import SYSTEM_PROMPT, VALID_EMOTIONS, DEFAULT_EMOTION
except ImportError:
    from backend.prompts import SYSTEM_PROMPT, VALID_EMOTIONS, DEFAULT_EMOTION

load_dotenv()

app = FastAPI(title="Poetic Year")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = "gemini-3.5-flash"

# Create a global Gemini client
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    gemini_client = genai.Client(api_key=api_key)
else:
    gemini_client = genai.Client(
        vertexai=True,
        project=os.getenv("GOOGLE_CLOUD_PROJECT"),
        location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1"),
    )

class GenerateRequest(BaseModel):
    date: str
    title: str
    feeling: str
    description: Optional[str] = ""

class GenerateResponse(BaseModel):
    poemLines: List[str]
    emotionTheme: str

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_poem(request: GenerateRequest):
    """Take an event description and generate a poetic response."""
    if not request.date.strip() or not request.title.strip() or not request.feeling.strip():
        raise HTTPException(
            status_code=400,
            detail="Missing required fields (date, title, feeling)."
        )

    user_text = f"Date: {request.date}\nTitle: {request.title}\n"
    if request.description:
        user_text += f"Description: {request.description}\n"
    user_text += f"Feeling: {request.feeling}"

    user_prompt = f"Please write a poem for this memory:\n\n{user_text}"

    try:
        response = gemini_client.models.generate_content(
            model=MODEL,
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": SYSTEM_PROMPT + "\n\n" + user_prompt}],
                }
            ],
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
            ),
        )

        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

        data = json.loads(response_text)

        # Validate core fields
        if "poemLines" not in data or "emotionTheme" not in data:
            raise ValueError("Missing required fields in AI response")
        if not isinstance(data["poemLines"], list) or not (2 <= len(data["poemLines"]) <= 4):
            raise ValueError("Expected 2 to 4 poem lines")

        if data.get("emotionTheme") not in VALID_EMOTIONS:
            data["emotionTheme"] = DEFAULT_EMOTION

        return GenerateResponse(poemLines=data["poemLines"], emotionTheme=data["emotionTheme"])

    except Exception as e:
        print(f"Generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail="The candlelight flickered. Please try again.",
        )

@app.get("/api/health")
async def health():
    return {"status": "glowing"}

# Mount frontend static files
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
