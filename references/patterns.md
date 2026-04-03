# ASCII skill — layout patterns

Use these names in markup and when describing intent to the user.

## Roles

| Role | When | Behavior |
|------|------|----------|
| `hero` | Primary full-bleed hero, main stage | Larger cells, strong mouse glow, optional 3D tilt (`perspective3d`), higher motion speed |
| `feature` | Section highlight, callouts, device frames | Medium density, moderate glow and tilt |
| `ambient` | Bento tiles, card backgrounds, side rails | Small cells, low `--ascii-opacity`, minimal parallax, **no** 3D |

## Required container CSS

- `position: relative` (the script will set this if still `static`)
- Explicit height for heroes (e.g. `min-height: 70vh`)
- Optional theme hooks on the same element:

```css.example
.my-ascii-zone {
  --ascii-fg: color-mix(in oklab, var(--foreground) 75%, transparent);
  --ascii-accent: var(--accent, #7ee787);
  --ascii-bg: transparent;
  --ascii-opacity: 0.85;
  --ascii-font: ui-monospace, "Geist Mono", monospace;
}
.ascii-ambient {
  --ascii-opacity: 0.18;
}
```

## Markup (auto-init)

```html
<script src="path/to/ascii-skill.js" defer></script>
<script defer>document.addEventListener('DOMContentLoaded', () => AsciiSkill.initAll());</script>

<div data-ascii-skill data-ascii-role="hero" style="min-height:72vh"></div>
<div data-ascii-skill data-ascii-role="ambient" data-ascii-3d="false" class="card-bg"></div>
```

## Programmatic placement (React / Vue / etc.)

Mount after the container ref exists; call `destroy()` on unmount.

```javascript
const el = containerRef.current;
const skill = new AsciiSkill(el, { role: 'feature', cellSize: 10 });
return () => skill.destroy();
```

## Decorative frame (ASCII border)

Wrap content in a `<pre class="ascii-frame">` or draw a single-line border with box-drawing chars (`─│┌┐└┘`) proportional to width using a tiny script or server render. Keeps the inner zone clean for text while the field fills the inside rectangle.
