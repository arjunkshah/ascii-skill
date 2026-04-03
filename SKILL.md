---
name: ascii-skill
description: Add beautiful, theme-aware, mouse-reactive ASCII art layers to web UIs ($ascii). Use when the user asks for ASCII decoration, terminal aesthetic, reactive backgrounds, hero treatments, or subtle bento/card backdrops. Ships a small canvas runtime plus layout roles (hero, feature, ambient).
---

# ASCII skill

When the user invokes **$ascii** (or asks for ASCII / monospace reactive visuals), add a **canvas-driven ASCII field** that respects site theme and layout context.

## Workflow

1. **Classify the surface**
   - **Hero / main focal UI** → `data-ascii-role="hero"` — dense interaction, faster drift, optional 3D tilt (default on).
   - **Supporting section / CTA block** → `data-ascii-role="feature"`.
   - **Bento tile, card BG, quiet panel** → `data-ascii-role="ambient"` — small cells, low opacity, set `data-ascii-3d="false"` and lower `--ascii-opacity` (e.g. `0.12–0.28`).

2. **Wire assets**
   - Copy `assets/ascii-skill.js` into the project (or reference raw URL from the published repo).
   - Ensure the host page runs `AsciiSkill.initAll()` on `DOMContentLoaded` (or instantiate manually in SPA lifecycle).

3. **Container rules**
   - Wrapper must have dimensions (`min-height` for heroes). The script sets `position: relative` and `overflow: hidden` if needed.
   - Layer real content **above** the field (the canvas is inserted as the first child with `pointer-events: none`).

4. **Theme**
   - Prefer inheriting colors: set `--ascii-fg`, `--ascii-accent`, `--ascii-bg`, `--ascii-opacity`, `--ascii-font` on the same element that carries `data-ascii-skill`. If omitted, foreground/color from computed styles is used.

5. **Optional frame**
   - For heroes, surround inner content with an ASCII box border (`─│┌┐└┘`) or a `<pre>` frame; keep tagline/copy in a corner with normal body typography.

## Snippet — static page

```html
<link rel="stylesheet" href="/your-styles.css" />
<script src="/assets/ascii-skill.js" defer></script>
<script defer>
  document.addEventListener("DOMContentLoaded", function () {
    AsciiSkill.initAll();
  });
</script>

<section
  class="hero ascii-themed"
  data-ascii-skill
  data-ascii-role="hero"
  style="min-height: 78vh;"
>
  <!-- foreground content -->
</section>
```

## Snippet — ambient card

```html
<div
  class="bento-tile"
  data-ascii-skill
  data-ascii-role="ambient"
  data-ascii-3d="false"
  data-ascii-cell-size="6"
  style="min-height: 220px; --ascii-opacity: 0.2;"
>
  <div style="position: relative; z-index: 1">…copy…</div>
</div>
```

## API (manual control)

- `new AsciiSkill(element, { role, cellSize, followMouse, perspective3d })`
- `instance.destroy()` on teardown.

Details and layout table: see `references/patterns.md`.

## Quality bar

- Match site palette; never clash with WCAG contrast for overlaid text.
- Respect `prefers-reduced-motion` in host CSS: e.g. disable 3D or hide field with `@media (prefers-reduced-motion: reduce) { [data-ascii-skill] { display: none } }` — only if product policy requires it; otherwise reduce opacity and skip 3D via attribute.
- Keep one primary `hero` ASCII per viewport; unlimited `ambient` tiles.

Repository: https://github.com/arjunkshah/ascii-skill
