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
   git clone https://github.com/gca-americas/codingjam-year-in-poetry.git
   cd codingjam-year-in-poetry
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
