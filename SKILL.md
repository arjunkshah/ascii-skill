---
name: ascii-skill
description: Guide for $ascii — YOU generate original, site-specific ASCII decoration (frames, banners, grids, shading, wordmarks). Use when the user wants ASCII art, terminal aesthetic, monochrome diagrams, or typographic texture. Optional tiny canvas helper in assets/ only if a live mouse-reactive field fits the design; do not default to it or reuse the same pattern everywhere.
---

# ASCII skill ($ascii)

This skill is **not** a library of ready-made ASCII clips. **You create new ASCII** for each surface: shapes, borders, fills, and micro-patterns that fit the **product name, metaphor, layout role, and theme** of the current site or component.

## Default workflow (always)

1. **Infer context** — Brand voice (playful vs serious), color mode, monospace vs pixel font if any, and the **layout role**:
   - **Hero / main stage** — larger glyphs, richer composition (multi-line banner, corner flourishes, framed rectangle), maybe implied depth (layered densities). Still readable at a glance.
   - **Feature / section** — medium scale: dividers, section headers in ASCII, one strong motif.
   - **Ambient / card / bento bg** — sparse dotted grids, light hashes, tiny waves, low visual weight; must not compete with text.

2. **Invent the piece** — Choose a **fresh** structure every time. Examples of *categories* (not templates to copy verbatim):
   - Box frames: `─ │ ┌ ┐ └ ┘` or `═ ║ ╔ ╗ ╚ ╝` or mixed weights for emphasis.
   - Shading ramps: ` · ·░▒▓` or ` .:-=+*#%@` — pick length and mood to match UI.
   - Word-sized “logotype” blocks: hand-draw 3–6 line ASCII for a short word or acronym **for this project**.
   - Decorative rules, chevrons, waves `∿`, brackets `⟨ ⟩`, circuit-ish paths, etc., aligned to narrative.

3. **Implement** — Usually `<pre>` with `font-family: ui-monospace` (or the site’s mono), `white-space: pre`, line-height ~1, color from tokens (`color-mix`, `opacity`). Layer behind real content with `position`/`z-index` or grid stacking. **Preserve alignment**: every line same width where the design requires a rectangle.

4. **Accessibility & motion** — Prefer static ASCII unless the user wants movement. If animating (rotating frame, typing effect), respect `prefers-reduced-motion`. Never block reading with busy backgrounds.

5. **Do not** — Paste identical art from another project, spam huge FIGlet dumps without layout purpose, or slap the optional canvas on every card “because the skill exists.”

Deep catalogs of charsets, roles, and implementation notes: `references/patterns.md`.

---

## Install the skill

Use the **Agent Skills** CLI (`npx skills`) and point it at this repo:

```bash
npx skills add https://github.com/arjunkshah/ascii-skill
```

Short form:

```bash
npx skills add arjunkshah/ascii-skill
```

That installs the skill (this `SKILL.md`, `references/`, `assets/`) into the agent paths your CLI is configured for (e.g. project `.claude/skills/`, `.codex/skills/`, etc.). Use the CLI’s flags for a specific agent or scope if needed (`npx skills --help`).

---

## Optional: live mouse-reactive field (`assets/ascii-skill.js`)

Use **only** when a **fluid, cursor-reactive** ASCII *field* (not a fixed `<pre>`) genuinely matches the design—e.g. hero atmosphere or a single feature panel.

- Run **`npx skills add`** (above) or copy `assets/ascii-skill.js`; add `data-ascii-skill`, call `AsciiSkill.initAll()` after load (see `references/patterns.md`).
- Still set **custom** CSS variables on the host so the field matches **this** theme.
- **Ambient** tiles: `data-ascii-role="ambient"`, low `--ascii-opacity`, `data-ascii-3d="false"`.
- **Turbo / density** (optional): `data-ascii-turbo="true"` for faster drift + snappier cursor tracking + stronger waves; `data-ascii-density="high"` for a wider shading charset. Use sparingly (heroes, demos)—not for quiet cards unless explicitly requested.
- **Minimal** (optional): `data-ascii-style="minimal"` for large cells, sparse charset (`·∙`), slow drift, no 3D—suited to light, whitespace-heavy UIs.

The script does **not** replace authoring; it’s one technique for motion + density. Static bespoke ASCII is often the right answer.

Repository: https://github.com/arjunkshah/ascii-skill
