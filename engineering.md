# Poetic Year — Engineering Design Doc

**Author:** Antigravity
**Status:** Draft v0.1
**Last updated:** June 5, 2026
**Reviewers:** User

---

## 1. Summary

Poetic Year is a single-screen web application that transforms user-entered dates and memories into short, AI-generated poems displayed on a candlelit timeline. The architecture relies on a static Vanilla HTML/CSS/JS frontend served by a lightweight Python/FastAPI backend, which interfaces with the Google Gemini API to generate the poetry. The system is designed for transient, session-only use with no database.

## 2. Assumptions

- **Target scale:** <10k DAU in v1.
- **Latency budget:** p95 <3s for the core poem generation.
- **Platform:** Web browser (mobile and desktop).
- **Out of scope:** Authentication, database persistence, multi-region scaling, caching.

## 3. Goals & non-goals

**Goals (v1):**
- Serve a fast, responsive static frontend.
- Generate high-quality 2-4 line poems via the Gemini API based on user input.
- Poem generation p95 <3s.

**Non-goals (v1):**
- No user accounts or authentication.
- No database or persistent storage (state lives entirely in the client's browser session).
- No complex frontend framework (no React/Vue; sticking to Vanilla JS for simplicity and performance).

## 4. Architecture

The architecture mirrors the `moodjar-example` reference: a FastAPI server handling the AI generation and serving the static frontend files.

```mermaid
flowchart LR
  Client[Web Browser (Vanilla JS)] -->|POST /api/generate| API[FastAPI Server]
  API -->|prompt| Gemini[(Google Gemini API)]
  Gemini --> API
  API --> Client
  API -->|Serves Static Files| Client
```

**What's here:**
- **FastAPI Server** — Serves static files and provides the `/api/generate` endpoint.
- **Gemini API Integration** — Uses the `google-genai` SDK to prompt the model.
- **Vanilla JS Frontend** — Manages the session state and renders the timeline.

**What's deliberately NOT here:**
- No Database — user data is transient, preventing privacy concerns and reducing infrastructure complexity.
- No React/Vue — the UI is simple enough that a framework would only add bloat.

## 5. Key components

### FastAPI Backend
- **Responsibility:** Serve static files and proxy requests to Gemini.
- **Tech choice:** Python, FastAPI, Uvicorn.
- **Why this choice:** Lightweight, fast to write, excellent async support, matches the reference architecture.
- **Interface:** `POST /api/generate`, `GET /`

### Gemini Integration (`google-genai`)
- **Responsibility:** Generate the poetic response.
- **Tech choice:** `google-genai` SDK with `gemini-3.5-flash`.
- **Why this choice:** Flash is fast and well-suited for short text generation tasks.
- **Interface:** Takes a user description and date, returns a structured JSON poem.

### Frontend App
- **Responsibility:** Capture input, manage the timeline state, render the candlelit UI.
- **Tech choice:** Vanilla HTML, CSS, JavaScript.
- **Why this choice:** Low overhead, direct DOM manipulation is sufficient for a single-screen app.

## 6. Data model

The data model exists only in memory (client-side JS) and over the wire (JSON).

```typescript
// Request Payload (Client -> Server)
type GenerateRequest = {
  date: string;       // e.g., "October 14"
  title: string;      // e.g., "Barnaby's Gotcha Day"
  description?: string; // Optional context
  feeling: string;    // e.g., "Overjoyed and a bit chaotic"
};

// Response Payload (Server -> Client)
type GenerateResponse = {
  poemLines: string[]; // 2-4 lines of generated poetry
  emotionTheme: string; // e.g., "joy", "tender", "nostalgia" (used for UI color)
};

// Client-Side Timeline Entry
type TimelineEntry = {
  id: string;          // UUID generated on client
  date: string;
  title: string;
  poemLines: string[];
  emotionTheme: string;
};
```

**Notes:**
- No server-side persistence.
- Session state is kept in a simple JS array.

## 7. API surface

### `POST /api/generate`

- **Input:** `{ "date": "Oct 14", "title": "Barnaby's Gotcha Day", "feeling": "so happy" }`
- **Output:** `{ "poemLines": ["A small paw found its home", "In the quiet of autumn"], "emotionTheme": "tender" }`
- **Errors:** 
  - `400 Bad Request` if fields are missing.
  - `500 Internal Server Error` if Gemini API fails (client shows fallback UI).
- **Latency budget:** p95 <3s end-to-end.

## 8. Key trade-offs (with rejected alternatives)

### Decision: No Database Persistence
- **Chose:** Session-only state in the browser.
- **Considered:** SQLite on the backend to save generated calendars.
- **Why we picked this:** Reduces infrastructure needs to zero, eliminates privacy/GDPR concerns for personal journal entries, and aligns with the intimate, transient "candlelight" aesthetic.

### Decision: Vanilla JS vs React
- **Chose:** Vanilla JS.
- **Considered:** React + Vite.
- **Why we picked this:** The app has a single screen and linear state updates (appending to a list). React is unnecessary overhead for this scope.

## 9. Risks & unknowns

- **Gemini API Latency** — Likelihood: Medium — Mitigation: We will use `gemini-3.5-flash` for the fastest possible response, and design the UI to show a "breathing" loading state so the wait feels intentional.
- **Prompt Injection/Safety** — Likelihood: Low — Mitigation: Accepted; since the data is not shared or saved, users injecting prompts only affect their own local session.

## 10. Testing strategy

**Unit tests (must have):**
- `prompt_builder.py` — Test that the system prompt correctly incorporates the user's date and description.
- `response_parser.py` — Test that the raw text/JSON from Gemini is safely parsed into the `GenerateResponse` schema, handling malformed outputs gracefully.

**Integration tests (one per happy path):**
- `Test_Generate_Endpoint` — Call `POST /api/generate` with mocked Gemini responses to verify the FastAPI endpoint correctly unpacks the request and returns the HTTP 200 JSON.

**Deliberately not tested (and why):**
- **Frontend DOM rendering** — Purely visual and easily caught by manual verification during development.
- **Gemini actual output quality** — AI outputs are non-deterministic; we test the *call* structure, not the poetic quality of the generated text.

**Stack defaults:**
- Python → `pytest`
- Tests live in `tests/` folder.

## 11. Rollout & monitoring

- **Rollout:** Direct deployment to a single server or Firebase App Hosting.
- **Monitoring:** Track HTTP 500s on the `/api/generate` route.
- **Rollback plan:** Revert to the previous git commit.

## 12. Cost & capacity

- **Per-user cost:** ~100 input tokens + ~50 output tokens = negligible fractions of a cent per request.
- **What breaks at 10× scale:** Uvicorn might drop connections if requests queue up; we'd scale by adding more Uvicorn workers or deploying behind a load balancer.

## 13. Open questions

- [ ] Will we need to enforce a character limit on the description to keep prompts short? (Owner: Antigravity)

## 14. Out of scope (will not do)

- **No User Database** — We are not setting up SQLAlchemy, Alembic, or Postgres.
- **No Rate Limiting Infrastructure** — For v1, we will not deploy Redis for rate limiting; we accept the minimal risk of abuse at this scale.
