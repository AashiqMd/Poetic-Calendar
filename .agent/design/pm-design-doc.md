# Poetic Year — Product Design Doc

**Author:** Antigravity
**Status:** Draft v0.1
**Last updated:** June 5, 2026
**One-liner:** Turn your special dates and milestones into a candlelit, poetic journey through your year.

---

## 1. The user & the moment

Who is this for, and what are they doing/feeling **right before** they open the app?

- **Who:** Someone winding down after a long day or week, looking for a moment of quiet, emotional reflection on their year's personal highlights.
- **When:** Late evening, sitting in a dimly lit room with a warm beverage, ready to reminisce.
- **Why now:** Traditional calendars are corporate planners. Social media feeds are chaotic, performative, and public. There is no intimate, private space for quiet, solo, poetic reflection on personal milestones.

## 2. The contract (I/O)

The most important section. What does the user give, and what do they get back?

- **Input:** A date selector (Month/Day) and a text box to write a short description of the special event (e.g., "Adopted Barnaby the cat").
- **Output:** A candlelit, interactive timeline featuring custom, AI-written short poems or warm poetic notes for each entered date.
- **The loop:** Open app -> Enter date and description -> Watch the event dissolve into a glowing timeline -> Scroll through the poetic map of the year.

## 3. The magical moment

The single sentence the user would say to a friend after using this for the first time. Write it in their voice.

> "Looking at my year laid out like a soft, candlelit poem makes all these memories feel so warm and real."

## 4. Scope: what we ARE building (v1)

A bulleted list of the minimum surface area. Each bullet is a thing a user can do or see.

- A clean, dark-themed intro screen with a form to enter one or more events (each requiring a Date and a Description).
- A generation step using the Gemini API to write a warm, short poem (2–4 lines) for each event.
- An interactive, scrollable vertical timeline displaying the dates, descriptions, and their corresponding poems.
- Smooth, ambient transitions (e.g., lights dimming, elements fading in slowly, candlelight flicker).

## 5. Scope: what we are NOT building

Equally important. The cuts ARE the product. List the obvious things people will ask for that we're explicitly NOT doing in v1, and one-line why.

- **No user accounts or login** — keeps the experience completely private and local.
- **No data persistence beyond the session** — refresh clears all entries, keeping it a transient, present-moment experience.
- **No calendar integrations or suggestions** — no Google Calendar sync or automatic imports to maintain focus on manual reflection.
- **No edit or delete flows** — once an event is added, it is woven into the session's poem.
- **No social sharing buttons** — sharing ruins the private, "candlelit date night" intimacy of the reflection.

## 6. The signature detail

The "Candlelight Room" ambient background: a soft, breathing, warm glowing orb (simulating a candle flame) that sits in the background. It responds with gentle ripples and flickers as the user scrolls or interacts with a timeline entry. The typography is elegant, serif (e.g., Playfair Display or Cormorant Garamond), with ample negative space to emphasize stillness and quiet.

## 7. Success: how we know it worked

Pick ONE primary signal.

- **Primary:** Users spend at least 3 minutes scrolling and reading their generated calendar on their first session.
- **What we're NOT measuring:** Total signups or return visits (since it is a transient, session-only utility).

## 8. Open questions

Real unknowns that need answers before/during build.

- [ ] Should we pre-fill a default example date to let the user see how it works instantly?
- [ ] What is our fallback UI if the Gemini API call fails or times out?

## 9. Handoff

- **For UX:** The transition from the input form to the calendar timeline needs to feel like entering a quiet room (e.g., input form fades, background darkens, and the candlelight orb fades in).
- **For Eng:** Keep the Gemini API call fast (<3s) and use a robust system prompt to generate concise, highly poetic 2-4 line verses rather than generic platitudes.
