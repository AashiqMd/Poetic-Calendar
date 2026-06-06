# Poetic Year — UX Design Doc

**Designer:** Antigravity
**Status:** Draft v0.1
**Last updated:** June 5, 2026

---

## 1. The design bet

We're betting that the "Listening Room" candlelit aesthetic carries the entire emotional weight of the product, so we're spending 80% of our design effort on the ambient background and the typography, keeping the UI controls nearly invisible to allow the generated poems to shine as the primary focus.

## 2. The defining interaction

User types their event and taps 'Add to Timeline'. The button softly depresses. The input area gently fades to 50% opacity, and a soft, warm shimmer emerges from the background orb. After ~2s, the newly generated poem fades in slowly on the timeline below, accompanied by a subtle flicker of the ambient "candle." The text input clears and returns to full opacity. Total time: ~3s. Feels like: writing a wish on a lantern and watching it float away.

## 3. Screen inventory

- **Main Experience** — A single, continuous scrollable screen combining the input area at the top and the timeline below.

## 4. Screen-by-screen specs

### Main Experience

**Purpose:** Provide a quiet, single-page sanctuary to input memories and view the poetic timeline.

**Layout (top to bottom):**
1. Ambient Background Orb — soft, breathing, dynamic glowing element.
2. Input Form — minimal, transparent fields with thin borders: Date Picker, Event Title, Optional Description, and "How did you feel?" input.
3. 'Add to Timeline' Button — pill-shaped, text only, subtle glow on hover.
4. Vertical Timeline — a delicate, thin vertical line.
5. Timeline Entries — elegant text nodes attached to the timeline showing the date, title, and generated poem.

**Key interactions:**
- Tap 'Add to Timeline' → Triggers generation; background orb flickers warmly.
- Scroll down the timeline → The background orb shifts slightly to maintain a candlelit effect over the currently viewed entry.

**States:**
- **Default:** Ready for input.
- **Empty / first-time:** The timeline area is empty. A soft, translucent prompt reads "Your year is waiting to be written."
- **Loading:** Input dims; background orb pulses gently for ~2s while the poem generates.
- **Error:** If generation fails, a soft, red-tinted message fades in: "The candlelight flickered. Please try again."
- **Edge / "too much":** The page scrolls infinitely; as more entries are added, older ones remain elegantly spaced.

## 5. The user journey

User opens the app for the first time. They are greeted by a deep, dark screen with a warm, breathing orb in the center. A delicate prompt asks them to add a memory. They enter "Moved to a new city" and the date, then tap 'Add'. The form dims, the orb pulses warmly, and a few seconds later, a beautiful 3-line poem fades in on a new timeline entry below. They smile, scroll down to see it fully, and the orb's light seems to follow their scroll. They feel a sense of calm and nostalgia.

## 6. Component & visual notes

- **Typography:** Serif (Playfair Display or Cormorant Garamond) for the poems to feel literary and timeless. Sans-serif (Inter) for functional UI elements (dates, button text).
- **Color:** Deep charcoal/black background (`#0A0A0A`). The ambient glow accents shift based on the emotion of the event in view (e.g., `#FFD166` for bright joy, `#F4A261` for warmth, `#E0B0FF` for tender nostalgia).
- **Motion:** Everything fades slowly. No snapping, no bouncing. The background orb "breathes" continuously (scale 1.0 to 1.05 over 4 seconds) and cross-fades its color when scrolling between differently-toned memories.
- **The signature visual:** The emotion-responsive breathing orb. It's a CSS radial gradient that softly shifts in opacity, size, and hue, casting a perfectly matched emotional glow over the text.
- **Microcopy voice:** Quiet, poetic, soft. 'Add memory' instead of 'Submit'. 'Generating...' becomes a silent pulse of light.

## 7. Accessibility & inclusion

- High contrast text against the dark background.
- The breathing animation will respect `prefers-reduced-motion` by reducing the scale shift or pausing entirely.
- (Deferred for v2: Full screen reader support for the timeline structure due to the transient session nature).

## 8. What we are NOT designing

- **No settings screen** — no dark/light mode toggle (it is strictly dark/candlelit).
- **No confirmation modals** — adding to the timeline is immediate and irreversible for the session.
- **No full-screen image generation** — the output is text-only poetry.

## 9. Open design questions

- [ ] How large should the background orb be relative to the viewport?
- [ ] Should the timeline entries be centered or left-aligned?

## 10. Handoff to engineering

The ambient orb breathing animation and the poem fade-in timing are the moments of magic — we need to nail the CSS transitions (target: 2s fade-in). The UI is entirely vanilla HTML/CSS without complex frameworks to keep the payload light.
