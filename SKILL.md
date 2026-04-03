---
name: ascii-skill
description: For ASCII / monospace character art in your outputs—actual glyphs in text, not UI chrome. Keep it clean, simple, and responsive. Use depth (“3D”) only inside the character composition when the user asks. Optional assets/ascii-skill.js for a live field when it truly fits.
---

# $ascii

**ASCII here means characters:** grids and lines you type in `<pre>` or plain text—` .:-=+*#@`, box-drawing, light shading. Not “ASCII style” cards, stacks, or CSS 3D UI.

If the user wants **3D**, show depth **in the art** (layered tones, blocks, isometric-ish faces, stronger ramps)—still monospace, still readable. Do not substitute rotating HTML panels for that.

## How to work

1. **Fit the surface** — Hero vs section vs quiet background: scale density to the role; sparse beats cluttered.
2. **Stay responsive** — Fixed-width `<pre>` with `overflow-x: auto`; simplify or drop heavy frames on small breakpoints if needed.
3. **Ship simple** — Prefer a small charset and clear silhouette; only widen the ramp when it serves the idea.
4. **Motion** — Static by default. Animate only if asked; respect `prefers-reduced-motion`.

**Avoid** — Reusing the same banner everywhere, huge tall blocks for no reason, or dropping the canvas script on every surface.

More charsets and wiring for the optional helper: `references/patterns.md`.

## Optional: `assets/ascii-skill.js`

Live, cursor-aware **character field**—not a replacement for hand-authored `<pre>`. Use sparingly. `data-ascii-3d` on the host only tweaks perspective/motion **of that field**; it is separate from “3D” shading you draw in static ASCII.
