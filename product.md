# Poetic Year — Product Design Doc

**Author:** Antigravity
**Status:** Draft v0.1
**Last updated:** June 5, 2026
**One-liner:** Turn your special dates and milestones into a candlelit, poetic journey through your year.

---

## 1. The user & the moment

- **Who:** Someone winding down after a long day or week, looking for a moment of quiet, emotional reflection on their year's personal highlights.
- **When:** Late evening, sitting in a dimly lit room with a warm beverage, ready to reminisce.
- **Why now:** Traditional calendars are corporate planners. Social media feeds are chaotic, performative, and public. There is no intimate, private space for quiet, solo, poetic reflection on personal milestones.

## 2. The contract (I/O)

- **Input:** A date selector (Month/Day), the title of the event, an optional brief description, and a field asking "How did you feel?".
- **Output:** A candlelit, interactive timeline featuring custom, AI-written short poems or warm poetic notes for each entered date. The visual glow of the timeline shifts to reflect the emotion of the moment.
- **The loop:** Open app -> Enter details -> Watch the event dissolve into a glowing timeline -> Scroll through the poetic map of the year, with the ambient light shifting to match each memory's mood.

## 3. The magical moment

> "Looking at my year laid out like a soft, candlelit poem makes all these memories feel so warm and real."

## 4. Scope: what we ARE building (v1)

- A clean, dark-themed intro screen with a form to enter one or more events (Date, Title, Optional Description, and Feeling).
- A generation step using the Gemini API to write a warm, short poem (2–4 lines) and determine the emotional tone.
- An interactive, scrollable vertical timeline displaying the dates, titles, descriptions, and their corresponding poems.
- Smooth, ambient transitions where the background glow shifts subtly based on the detected emotion (e.g., radiant gold for a wedding, soft peach for a quiet moment).

## 5. Scope: what we are NOT building

- **No user accounts or login** — keeps the experience completely private and local.
- **No data persistence beyond the session** — refresh clears all entries, keeping it a transient experience.
- **No calendar integrations** — no Google Calendar sync.
- **No edit or delete flows** — once an event is added, it is woven into the session's poem.
- **No social sharing buttons** — sharing ruins the private intimacy.

## 6. The signature detail

The "Candlelight Room" ambient background: a soft, breathing, warm glowing orb that sits in the background. It responds with gentle ripples, flickers, and subtle color shifts as the user scrolls to different events (e.g., bright golden for exuberant joy, soft tender pink/peach for intimate moments). The typography is elegant, serif (e.g., Playfair Display or Cormorant Garamond), with ample negative space to emphasize stillness and quiet.

## 7. Success: how we know it worked

- **Primary:** Users spend at least 3 minutes scrolling and reading their generated calendar on their first session.
- **Not measuring:** Total signups or return visits.

## 8. Open questions

- [ ] Should we pre-fill a default example date to let the user see how it works instantly?
- [ ] What is our fallback UI if the Gemini API call fails or times out?

## 9. Handoff

- **For UX:** The transition from the input form to the calendar timeline needs to feel like entering a quiet room.
- **For Eng:** Keep the Gemini API call fast (<3s) and use a robust system prompt to generate concise, highly poetic verses.
