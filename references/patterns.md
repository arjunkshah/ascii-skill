# ASCII skill — authoring reference

**Characters in text** — Depth, “3D,” and shading live in the **glyph grid** (what you output), not in 3D-transformed cards or generic UI stacks.

## Layout roles (calibrate complexity)

| Role | Density | Typical forms |
|------|--------|----------------|
| Hero | High | Multi-line frame, corner accents, optional large word block, inner copy in normal type |
| Feature | Medium | Section underline, left rail, device “bezel” in ASCII, short banner |
| Ambient | Low | Sparse dots, faint diagonal hashes, tiny repeating motif, wide line spacing |

## Tooling (pick per project)

- **Charset** — Match tone: minimal ` .-` for calm; technical `├─┤` trees; bold `$#@&` for grit. Combine with the site’s accent (e.g. rare `*·` for sparkle).
- **Box styles light** — `─│┌┐└┘ ├┤┬┴┼` (Unicode light box drawing).
- **Box styles heavy** — `═║╔╗╚╝` for emphasis borders.
- **Shading** — Ordered ramps give predictable “light direction”: e.g. ` .'` or `░▒▓` or block elements.
- **Symmetry** — Centered rules and mirrored wings read as intentional; asymmetric breaks draw the eye to CTA side.

## Implementation

- **`<pre>`** — Fixed art lives here; match `font-family` (mono stack) and `font-size`; no accidental proportional fonts.
- **Responsive** — `overflow-x: auto`; on small widths, fewer lines, thinner frames, or a lighter motif so it doesn’t dominate.
- **Color** — CSS vars / `color-mix` for quiet fills; keep contrast usable.
- **3D on request** — In static art: stepped ramps, facet outlines, or block stacks **made of characters**. That is not the same as `data-ascii-3d` on the canvas helper (field tilt only).

## Generative mindset (examples are *patterns*, not assets)

Illustrate **structure**, not copy these strings into every app:

- **Wave row** — vary phase per line: mix `~` `-` `.` with spaces for rhythm.
- **Corner brackets** — `╭` `╮` `╰` `╯` if available; fallback ASCII `+` corners in strict mono environments.
- **Grid** — `+---+` repeat vs spaced `·` for a field.

Each build should reference **this** page’s typography scale and **this** brand’s name or metaphor at least once where it feels natural.

---

## Optional canvas helper (`ascii-skill.js`)

When you choose a **live** field instead of or behind static art:

| Attribute | Meaning |
|-----------|---------|
| `data-ascii-skill` | Activate on this container |
| `data-ascii-role` | `hero` \| `feature` \| `ambient` |
| `data-ascii-cell-size` | Optional number |
| `data-ascii-3d="false"` | Disable tilt on the **live field** (not “3D ASCII art” in `<pre>`) |
| `data-ascii-turbo="true"` | Faster motion, tighter cursor follow, stronger waves (heroes / demos) |
| `data-ascii-density="high"` | Wider shading charset (`░▒▓` style ramp) for richer motion reads |
| `data-ascii-style="minimal"` | Sparse dots, slow motion, large cells, no 3D — quiet backgrounds |

Theme hooks on the same element: `--ascii-fg`, `--ascii-accent`, `--ascii-opacity`, `--ascii-font`.

Init:

```html
<script src="./assets/ascii-skill.js" defer></script>
<script defer>
  document.addEventListener("DOMContentLoaded", () => AsciiSkill.initAll());
</script>
```

Programmatic: `new AsciiSkill(el, { role: 'feature' });` then `destroy()` on unmount.

**Remember:** authored `<pre>` art is independent of this file; most UIs only need what you typed.
