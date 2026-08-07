# UI_SYSTEM.md

Design system and UI conventions actually used in the codebase, verified
by reading `src/ui/theme.css`, `src/index.css`, and representative
components.

## Theme tokens (`src/ui/theme.css`)

CSS custom properties, defined once under `:root` and used throughout the
DOM UI layer:

```css
--hba-bg: #14101c;               /* base background, near-black purple */
--hba-bg-soft: #1e1729;           /* slightly lighter panel/hover bg */
--hba-panel: rgba(20, 14, 28, 0.94);   /* semi-transparent overlay panel */
--hba-panel-solid: #1b1424;
--hba-border: #ffe066;             /* signature gold/yellow accent */
--hba-border-soft: rgba(255, 224, 102, 0.35);
--hba-text: #fff6ea;               /* warm off-white */
--hba-text-muted: #c9bcd8;
--hba-pink: #ff6ea6;
--hba-blue: #5b6ee1;
--hba-orange: #ff8f4d;
--hba-green: #6fae8f;
--hba-danger: #ff5d6c;
--hba-font: "Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif;
--hba-radius: 14px;
--hba-radius-sm: 8px;
```

Palette reads as a dark, warm, slightly retro anime-visual-novel aesthetic
— near-black purple background, gold accent borders, pink/blue/orange as
secondary accent colors, generous corner radius. Consistent with the
"colorful and funny on the surface, gradually unsettling underneath" tone
described in `README.md`.

## Base classes

- `.hba-root` — root container: full-size, `overflow: hidden`, sets font
  family/color/background for the whole app.
- `.hba-panel` — the standard panel look: `--hba-panel` background,
  `--hba-border-soft` border, `--hba-radius`, drop shadow. Used for menu
  overlays, dialogue box, HUD panels.
- `.hba-btn` — the standard button: `--hba-bg-soft` background,
  `--hba-border-soft` border, hover/selected state brightens the border to
  `--hba-border` and shifts background + a small `translateX(2px)` nudge;
  `:disabled` drops opacity to 0.4.
- `.hba-scanlines` — a subtle repeating-gradient overlay (CRT-scanline
  effect, `mix-blend-mode: overlay`, 0.5 opacity) — a deliberate retro
  texture layer, applied as an absolute-positioned overlay `div`, not
  baked into every panel.

## Region theming (separate system, not UI chrome)

`game/engine/palette.ts`'s `MAP_THEMES` (28 entries) is a **different**
theming system from the UI chrome above — it colors in-game map tiles per
region (floor/wall/decor colors), not menus/HUD. Don't conflate the two:
UI chrome is fixed across the whole app via `theme.css`; only the Phaser
canvas content re-themes per region.

## Component-level CSS convention

Every screen/component with meaningful styling gets its own co-located
`.css` file (e.g. `TitleScreen.tsx` + `TitleScreen.css`,
`HowToPlayScreen.tsx` + `HowToPlayScreen.css`), imported directly in the
component. No CSS-in-JS, no Tailwind, no CSS modules — plain CSS files
with the shared `.hba-*` base classes layered under component-specific
classes. `HowToPlayScreen.tsx` (uncommitted as of this pass) follows this
convention exactly, reusing `../menu/PauseMenu.css`'s `.menu-overlay`/
`.menu-panel` classes plus its own `.howtoplay-panel`/`.howtoplay-section`
additions — the established pattern of "reuse the closest existing
overlay convention, add a scoped extension," not a new one-off menu
system.

## Input-island convention (also a UI convention, not just engine)

Every interactive DOM overlay that needs keyboard input (DialogueBox,
FightBar, LockerPuzzle, PoetryPuzzle, pause/settings/menu screens via
`useMenuEscape`, battle menus via `useKeyboardMenuNav`) owns its own
`keydown` listener rather than relying on a relay from a Phaser scene.
This is as much a UI-layer rule as an engine rule — see `CLAUDE.md` rule 4
and `ARCHITECTURE.md`'s Input Handling section for the underlying reason
(Phaser's key-state system silently breaks after `scene.restart()`).

## Portraits (placeholder art, real system)

`ui/dialogue/Portrait.tsx` renders DOM/SVG portraits keyed by
`characterId` + `expression` — a real expression system (swaps
eyes/mouth paths per emotion), not a single static image per character.
Documented in `DEVELOPMENT_PLAN.md` as "a legitimate placeholder pipeline,
not a cop-out" — swappable 1:1 for real art without touching call sites.

## Accessibility-relevant UI state

`settingsStore.ts` (persisted) drives: text speed, screen shake,
flash-effects toggle (verified wired to a real camera-flash effect on
taking damage in battle, per `CHANGELOG.md` [0.20.0]), and
music/SFX volume sliders. All battle menus are fully keyboard-navigable
via `useKeyboardMenuNav` (W/S or arrows to cycle, Z/Enter to confirm,
optional `columns` for 2D grid nav) as of [0.21.0] — mouse is no longer
required anywhere in battle.
