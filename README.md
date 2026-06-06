# Poetic Year

Poetic Year is a beautiful, single-screen web application that transforms your special dates and personal memories into short, AI-generated poems displayed on a candlelit timeline. As you scroll through your timeline, an ambient background orb shifts its glow and color to match the emotional theme of your memories, creating an immersive, mesmerizing experience.

## Getting Started

This project is built using Python, FastAPI, Vanilla JavaScript/CSS, and the Google Gemini API. It uses `uv` for lightning-fast Python dependency management.

### Prerequisites

- Python 3.9+
- [uv](https://github.com/astral-sh/uv) (for dependency management)
- A Gemini API key

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/AashiqMd/Poetic-Calendar.git
   cd Poetic-Calendar
   ```

2. **Set up the backend environment**:
   Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   uv sync
   ```
   *(Note: The `backend` directory contains its own `pyproject.toml` and virtual environment setup.)*

3. **Configure your API Key**:
   Create a `.env` file in the `backend/` directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## Running the App

To run the development server locally, navigate to the `backend` directory and start Uvicorn:

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

Once the server starts, open your browser and go to:
**[http://localhost:8000](http://localhost:8000)**

## Documentation & Source of Truth

The complete architecture, design intent, and product requirements for this app are thoroughly documented in the project root. **Anyone can read these to understand the system:**

- `product.md`: The core product vision, user inputs, and magical moments.
- `ui.md`: Layout details, visual design, and emotion-driven color themes.
- `engineering.md`: The technical architecture, API payloads, and testing strategy.

*These three documents are the definitive source of truth for the project.*

## New Features (v1.1)

- **Reminisce Mode:** Click the "Reminisce" button to enter a full-screen, immersive mode that automatically scrolls through your generated poems one by one without losing your state.
- **Gathering Light Animation:** A gorgeous visual effect spawns highly-diffused, soft orbs of light from the edges of your screen that gather into the center orb each time a poem is generated.
- **Dynamic Orb Brightness:** The background orb permanently grows brighter and slightly larger as more events are added to your timeline.
- **Demo Mode:** Click the "Demo Mode" button to automatically populate sample events and watch the magic unfold with zero effort.
- **Custom Soundtrack:** The app plays a soft piano track (`soft_music.mp3`) as background music to accompany your reflection.
