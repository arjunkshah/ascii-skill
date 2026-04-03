# ASCII skill — authoring reference

Use this when you need ideas or technical guardrails while **generating new** ASCII for the task at hand.

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

- **`<pre>`** — Best for fixed art; set exact `font-family` stack and `font-size`; avoid accidental proportional fonts.
- **Overflow** — `overflow-x: auto` on narrow viewports; consider `@media` to simplify or hide ornate frames on small screens.
- **Color** — Tie to CSS vars: `color: color-mix(in oklab, var(--foreground) 55%, transparent);` for quiet fills.

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
| `data-ascii-3d="false"` | Disable tilt (use on ambient) |

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
