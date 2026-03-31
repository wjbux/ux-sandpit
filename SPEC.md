# SPEC.md — UX Wireframe Sandpit

## Purpose

A local wireframe prototyping tool for a UX team. Designers describe screens in plain English via the **GitHub Copilot CLI**. A **browser canvas** displays the results as frames — similar to Figma's canvas. No logic, no JavaScript in wireframes, no frameworks. Pure HTML and CSS only.

**Built with:** Claude Code (one-time scaffold)  
**Operated day-to-day with:** GitHub Copilot CLI  
**Stack:** Vite (dev server only), vanilla HTML/CSS, no frontend framework

---

## Project structure

```
/
├── index.html                        ← Canvas viewer (auto-discovers screens)
├── gallery.html                      ← Component gallery (shows all components + variants)
├── package.json
├── vite.config.js                    ← Includes plugin to serve /api/screens endpoint
├── README.md
├── SPEC.md                           ← This file
│
├── /components
│   ├── index.css                     ← @imports every component file. Screens link only this.
│   ├── base.css                      ← Reset, CSS custom properties, typography
│   ├── layout.css                    ← .page, .page-body, .main-content
│   ├── top-nav.css
│   ├── sidebar.css
│   ├── button.css
│   ├── card.css
│   ├── table.css
│   ├── form.css
│   ├── badge.css
│   ├── modal.css
│   ├── tabs.css
│   └── utility.css                   ← Spacing, flex helpers, text helpers
│
├── /screens
│   └── example.html                  ← Reference screen. Do not delete.
│
├── /scripts
│   └── guard.sh                      ← preToolUse hook: denies writes outside allowed paths
│
└── /.github
    ├── copilot-instructions.md       ← Global rules loaded by Copilot CLI automatically
    ├── /skills
    │   ├── /create-screen
    │   │   └── SKILL.md
    │   └── /add-component
    │       └── SKILL.md
    └── /hooks
        └── guard.json                ← Registers guard.sh as a preToolUse hook
```

---

## 1. Vite configuration (`vite.config.js`)

Vite serves the project. It must also expose a virtual JSON endpoint at `/api/screens` that the canvas uses to auto-discover screens without a manifest file.

### Requirements

- Serve the project root at `http://localhost:5173`
- Expose a `GET /api/screens` endpoint that reads the `/screens/` directory and returns a JSON array of screen objects
- The endpoint must handle the case where `/screens/` is empty (return `[]`)
- No other plugins or configuration needed

### `/api/screens` response shape

```json
[
  { "file": "example.html", "label": "Example screen" },
  { "file": "dashboard.html", "label": "Dashboard" }
]
```

The `label` is derived from the filename: strip the `.html` extension, replace hyphens and underscores with spaces, then title-case each word.

### Implementation note

Use a Vite plugin defined inline in `vite.config.js` using the `configureServer` hook. Use Node's `fs.readdirSync` to list `.html` files in the `/screens/` directory. Do not use any npm packages beyond what Vite already includes.

---

## 2. Canvas viewer (`index.html`)

The canvas is a dark-background viewer that displays all screens as iframes side by side, identical in concept to Figma's canvas. It is a standalone HTML file with no build step dependency — all JS is inline.

### Behaviour

- On load, fetch `/api/screens` and render one frame per screen
- Each frame is an `<iframe>` loading `screens/[file]`, rendered at 1280×720px then scaled down via CSS `transform: scale(N)`
- The canvas polls `/api/screens` every **3 seconds** and re-renders if the screen list has changed — this is how new screens created by Copilot appear automatically without a page refresh
- The polling diff must be by filename only; it must not cause a full re-render if nothing changed (iframes would flash/reload)
- When a screen is added, only the new iframe is injected. Existing iframes are not touched.
- When a screen is removed (file deleted), its frame is removed from the canvas

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ TOOLBAR: "Wireframe canvas"  [N screens]  [−] [100%] [+]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐            │
│  │           │   │           │   │           │            │
│  │  iframe   │   │  iframe   │   │  iframe   │            │
│  │           │   │           │   │           │            │
│  └───────────┘   └───────────┘   └───────────┘            │
│  example screen   dashboard        users                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Zoom

- Default zoom: 25% (i.e. `scale(0.25)` — 1280px frame renders at 320px wide)
- Zoom steps: 10%, 15%, 20%, 25%, 33%, 50%, 75%, 100%
- `−` and `+` buttons step through the array
- Zoom level must be applied to all existing and newly injected frames consistently
- Frame wrapper `div` must resize to match the scaled dimensions (i.e. `width: 1280 * scale px`) so frames don't overlap

### Toolbar

- Left: project name "Wireframe canvas" (static label)
- Centre: "[N] screens" count, updated when screen list changes
- Right: zoom controls

### Styling

- Background: `#1a1a1a`
- Toolbar: `#2a2a2a` with `1px solid #3a3a3a` border-bottom
- Screen labels: `12px`, `#666`, uppercase, letter-spaced
- Screen frames: white background, `border-radius: 3px`, strong drop shadow
- Canvas area: `overflow: auto`, `padding: 60px 80px`, `display: flex`, `gap: 60px`, `align-items: flex-start`
- All styling must be inline `<style>` in the file — no external CSS dependency

---

## 3. Component CSS system

### Philosophy

Each UI component lives in its own CSS file under `/components/`. Variants of a component (e.g. button states) are handled within that component's file using modifier classes (BEM-style double-dash: `.btn--primary`). Screens never link individual component files — they only ever link `../components/index.css`.

Screen-specific layout adjustments (e.g. a particular grid arrangement unique to one screen) may be added as `<style>` blocks within that screen's HTML file. This is acceptable and expected.

### `components/index.css`

Uses `@import` to pull in every component file in dependency order:

```css
@import './base.css';
@import './layout.css';
@import './utility.css';
@import './top-nav.css';
@import './sidebar.css';
@import './button.css';
@import './card.css';
@import './table.css';
@import './form.css';
@import './badge.css';
@import './modal.css';
@import './tabs.css';
```

### `components/base.css`

Defines the design token layer as CSS custom properties on `:root`. These are **placeholders** — the real values will be replaced when the team ports their actual Angular Material design system.

```css
:root {
  /* Brand — REPLACE with your actual design system tokens */
  --color-primary:        #1a1a1a;
  --color-primary-hover:  #333333;
  --color-primary-text:   #ffffff;

  /* Neutrals */
  --color-bg:             #ffffff;
  --color-bg-surface:     #f9f9f9;
  --color-bg-elevated:    #ffffff;
  --color-border:         #e5e5e5;
  --color-border-strong:  #d0d0d0;

  /* Text */
  --color-text-primary:   #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted:     #999999;

  /* Semantic */
  --color-success:        #2d7a3a;
  --color-success-bg:     #e6f4ea;
  --color-warning:        #9a6200;
  --color-warning-bg:     #fff4e0;
  --color-danger:         #c53030;
  --color-danger-bg:      #fde8e8;
  --color-info:           #1a5fd4;
  --color-info-bg:        #e8f0fe;

  /* Spacing scale */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs:   11px;
  --font-size-sm:   12px;
  --font-size-base: 14px;
  --font-size-md:   16px;
  --font-size-lg:   20px;

  /* Radii */
  --radius-sm:  5px;
  --radius-md:  7px;
  --radius-lg:  10px;
  --radius-xl:  14px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg);
  line-height: 1.5;
}
```

### Component files — class inventory and variants

Every component file must use `var(--*)` tokens exclusively. No hardcoded hex values.

#### `layout.css`

| Class | Description |
|-------|-------------|
| `.page` | Root wrapper. `display: flex; flex-direction: column; height: 720px; overflow: hidden` |
| `.page-body` | `display: flex; flex: 1; overflow: hidden` |
| `.main-content` | Scrollable main area. `flex: 1; padding: var(--space-lg); overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-lg)` |

#### `top-nav.css`

| Class | Description |
|-------|-------------|
| `.top-nav` | `height: 52px; border-bottom: 1px solid var(--color-border)` |
| `.top-nav__logo` | 28×28px brand placeholder square |
| `.top-nav__links` | Flex container for nav links |
| `.top-nav__link` | Nav link. Default: muted text |
| `.top-nav__link--active` | Active state: primary text, medium weight, subtle bg |
| `.top-nav__right` | `margin-left: auto` slot for avatar/actions |
| `.top-nav__avatar` | 30px circle placeholder |

#### `sidebar.css`

| Class | Description |
|-------|-------------|
| `.sidebar` | `width: 220px; background: var(--color-bg-surface); border-right: 1px solid var(--color-border)` |
| `.sidebar--narrow` | Width override: `60px` |
| `.sidebar__section-label` | Group heading. Uppercase, `var(--font-size-xs)`, muted |
| `.sidebar__item` | Nav row with icon slot |
| `.sidebar__item--active` | Active state |
| `.sidebar__icon` | 16×16px icon placeholder |
| `.sidebar__divider` | Thin horizontal rule between groups |

#### `button.css`

| Class | Description |
|-------|-------------|
| `.btn` | Base. Required on all buttons. `inline-flex; align-items: center; gap: var(--space-sm); padding: 8px 16px; font-size: var(--font-size-base); font-weight: 500; border-radius: var(--radius-md); border: 1px solid transparent; cursor: pointer; line-height: 1` |
| `.btn--primary` | Filled. `background: var(--color-primary); color: var(--color-primary-text)` |
| `.btn--secondary` | Outlined. White bg, border, primary text |
| `.btn--success` | Green semantic action |
| `.btn--danger` | Red destructive action |
| `.btn--ghost` | No border, no bg. For low-emphasis actions |
| `.btn--sm` | `padding: 5px 10px; font-size: var(--font-size-sm); border-radius: var(--radius-sm)` |
| `.btn--lg` | `padding: 11px 22px; font-size: var(--font-size-md)` |
| `.btn--icon` | Square button for icon-only actions. Equal padding all sides. |
| `.btn-group` | `display: flex; gap: var(--space-sm); align-items: center` |

#### `card.css`

| Class | Description |
|-------|-------------|
| `.card` | `background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-md) var(--space-lg)` |
| `.card--flat` | No shadow variant |
| `.card--interactive` | Hover state: slightly elevated shadow |
| `.card__header` | Top section with title + optional action |
| `.card__title` | `font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary)` |
| `.card__value` | Large KPI number. `font-size: 28px; font-weight: 600` |
| `.card__meta` | Supporting text. `font-size: var(--font-size-sm); color: var(--color-text-muted)` |
| `.card__body` | Content area with top padding |
| `.card__footer` | Bottom section, border-top |
| `.card-grid` | `display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px` |

#### `table.css`

| Class | Description |
|-------|-------------|
| `.table-wrap` | `border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden` |
| `.table-toolbar` | Top bar inside table-wrap for title + search/filter actions |
| `.table` | `width: 100%; border-collapse: collapse; font-size: var(--font-size-base)` |
| `.table th` | `background: var(--color-bg-surface); padding: 10px 16px; text-align: left; font-weight: 500; font-size: var(--font-size-sm); border-bottom: 1px solid var(--color-border)` |
| `.table td` | `padding: 12px 16px; border-bottom: 1px solid var(--color-border)` (last row: no border) |
| `.table tr:hover td` | `background: var(--color-bg-surface)` |
| `.table--striped` | Alternating row backgrounds |
| `.table--compact` | Reduced cell padding |

#### `form.css`

| Class | Description |
|-------|-------------|
| `.form-group` | `display: flex; flex-direction: column; gap: var(--space-xs)` |
| `.form-label` | `font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary)` |
| `.form-input` | Text input. `width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md)` |
| `.form-input--error` | Error state: red border |
| `.form-input--disabled` | Disabled state: muted bg |
| `.form-select` | Dropdown. Same dimensions as input |
| `.form-textarea` | `resize: vertical; min-height: 80px` |
| `.form-checkbox` | Checkbox + label row |
| `.form-radio` | Radio + label row |
| `.form-toggle` | Toggle switch (visual only, no JS) |
| `.form-hint` | `font-size: var(--font-size-sm); color: var(--color-text-muted)` |
| `.form-error` | `font-size: var(--font-size-sm); color: var(--color-danger)` |
| `.form-row` | `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md)` |
| `.form-section` | Grouped block of fields with optional heading |
| `.form-section__title` | Section heading within a form |

#### `badge.css`

| Class | Description |
|-------|-------------|
| `.badge` | Base. `display: inline-flex; padding: 3px 8px; font-size: var(--font-size-xs); font-weight: 500; border-radius: var(--radius-sm)` |
| `.badge--default` | Neutral grey |
| `.badge--success` | Green |
| `.badge--warning` | Amber |
| `.badge--danger` | Red |
| `.badge--info` | Blue |
| `.badge--outline` | Transparent bg, coloured border and text |
| `.badge--pill` | `border-radius: var(--radius-full)` |

#### `modal.css`

| Class | Description |
|-------|-------------|
| `.modal-overlay` | `position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100` — note: requires `.page { position: relative }` |
| `.modal` | Dialog box. `background: var(--color-bg-elevated); border-radius: var(--radius-xl); padding: var(--space-lg); width: 480px; max-width: 90%` |
| `.modal--sm` | Width override: `360px` |
| `.modal--lg` | Width override: `640px` |
| `.modal__title` | `font-size: var(--font-size-md); font-weight: 600` |
| `.modal__body` | `font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.6` |
| `.modal__footer` | `display: flex; justify-content: flex-end; gap: var(--space-sm); padding-top: var(--space-sm)` |

#### `tabs.css`

| Class | Description |
|-------|-------------|
| `.tabs` | `display: flex; border-bottom: 1px solid var(--color-border)` |
| `.tab` | `padding: 10px 16px; font-size: var(--font-size-base); color: var(--color-text-muted); border-bottom: 2px solid transparent; margin-bottom: -1px` |
| `.tab--active` | Primary text, medium weight, primary-coloured bottom border |
| `.tab-panel` | Content area below the tab bar (always visible — no JS toggling) |

#### `utility.css`

Flex helpers, spacing overrides, text helpers. Examples:

```css
.flex          { display: flex; }
.flex-col      { display: flex; flex-direction: column; }
.items-center  { align-items: center; }
.items-start   { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-end   { justify-content: flex-end; }
.gap-xs  { gap: var(--space-xs); }
.gap-sm  { gap: var(--space-sm); }
.gap-md  { gap: var(--space-md); }
.gap-lg  { gap: var(--space-lg); }
.w-full  { width: 100%; }
.mt-sm   { margin-top: var(--space-sm); }
.mt-md   { margin-top: var(--space-md); }
.mt-lg   { margin-top: var(--space-lg); }
.text-muted { color: var(--color-text-muted); font-size: var(--font-size-sm); }
.text-sm    { font-size: var(--font-size-sm); }
.divider    { height: 1px; background: var(--color-border); margin: var(--space-xs) 0; }
.avatar     { border-radius: 50%; background: var(--color-border); flex-shrink: 0; }
.avatar--sm { width: 24px; height: 24px; }
.avatar--md { width: 36px; height: 36px; }
.avatar--lg { width: 52px; height: 52px; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-sm); padding: 60px 20px; color: var(--color-text-muted); text-align: center; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title  { font-size: var(--font-size-lg); font-weight: 600; }
.page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px; }
```

---

## 4. Screens

### All screens must follow this template exactly

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="../components/index.css" />
  <!-- Screen-specific styles only. Use sparingly. -->
  <style>
    /* e.g. a unique grid layout for this screen only */
  </style>
</head>
<body>
<div class="page">
  <!-- content here using only classes from components/ -->
</div>
</body>
</html>
```

### Rules for all screens

- Link `../components/index.css` only — never link individual component files
- Never write JavaScript in screen files
- Never use inline `style=""` attributes — use component classes or the screen `<style>` block
- Never invent new class names not defined in `components/`
- Screen dimensions are always 1280×720px — controlled by `.page`
- Use realistic placeholder content (real-looking names, numbers, labels — not "Lorem ipsum")
- For screens showing modals or overlays, add `style="position: relative"` to the `.page` div

### `screens/example.html`

The reference screen. Must demonstrate: top-nav, sidebar, page-header with btn-group, card-grid with 4 stat cards, table-wrap with table. This file must never be deleted.

---

## 5. Component gallery (`gallery.html`)

A standalone HTML page that visually documents every component and every variant. It is a developer/designer reference — not a wireframe screen.

### Structure

- One section per component file
- Each section shows the component name as a heading, then renders every variant with its class name as a label beneath it
- Served by Vite at `http://localhost:5173/gallery.html`
- Links to `components/index.css`
- Must include: all button variants, all badge variants, form elements (input/select/textarea/toggle/checkbox), card variants, table example, modal (rendered inline, no overlay), tabs, sidebar, top-nav

### Styling

- White background, generous padding, section headings, clear component labels
- Dividers between sections
- This page may use extra inline `<style>` for gallery layout only (e.g. flex rows to show button variants side by side)

---

## 6. Copilot CLI configuration

### `.github/copilot-instructions.md`

This file is loaded automatically by Copilot CLI on every session in this repository. It governs all Copilot behaviour in this project.

Write it to cover:

**Identity and purpose**
- You are a wireframe assistant for a UX team
- You build static HTML screen layouts using a defined component library
- You never build logic, interactivity, or working application code

**Hard rules**
- Only use CSS classes defined in `components/`. Never invent new class names.
- Never write JavaScript in screen files
- Never use inline `style=""` attributes on HTML elements (screen `<style>` blocks are acceptable for screen-specific layout)
- Never link individual component CSS files — always use `../components/index.css`
- Screen dimensions are always 1280×720px. Never override the `.page` height.
- Use realistic placeholder text — not "Lorem ipsum"
- All screens go in `/screens/`. All component CSS goes in `/components/`. Never write files elsewhere.

**Available components**
List every class from every component file grouped by component. Include variants. This section must be kept in sync with `components/` — when a component is added, this section is updated.

**How to create a screen** (inline the create-screen skill steps here as a summary)

**How to update a screen**
- Edit the existing file in `screens/`
- Vite hot-reloads automatically
- Never rename a screen file without checking if it is referenced elsewhere

**Copilot CLI tips for this project**
- Use `/plan` before making multiple changes to confirm the approach
- Use `/diff` to review what has changed before accepting
- Use `/session` to see checkpoint history
- Run `npm start` in a separate terminal before starting work — the canvas auto-refreshes

---

### Skills

Skills live at `.github/skills/<name>/SKILL.md`. They are triggered automatically when Copilot judges them relevant to a prompt, or can be invoked by name. Each skill is a Markdown file with a description header and step-by-step instructions.

#### `.github/skills/create-screen/SKILL.md`

**Trigger phrases:** "create a screen", "add a screen", "new screen", "build a [name] screen"

**Steps the skill instructs Copilot to follow:**

1. Confirm the screen name with the user if not provided. Derive the filename as lowercase-hyphenated (e.g. "User Profile" → `user-profile.html`).
2. Check `/screens/` to ensure the filename does not already exist.
3. Create `/screens/[name].html` using the standard screen template (link `../components/index.css`, wrap in `.page`, no JavaScript).
4. Build the layout using only classes from `components/`. Use the user's description to decide which components to include. Reference `screens/example.html` for structural patterns.
5. Do not edit `index.html` — the canvas auto-discovers screens via `/api/screens`.
6. Confirm completion with the filename and a brief description of what was built.

**Notes:**
- If the user says "like the example screen but with X" — read `screens/example.html` first, then adapt
- If the user asks for a modal or overlay, add `style="position: relative"` to the `.page` div
- Always use realistic content in placeholders

#### `.github/skills/add-component/SKILL.md`

**Trigger phrases:** "add a component", "new component", "we need a [name] component", "add [name] to the component library"

**Steps the skill instructs Copilot to follow:**

1. Confirm the component name and what variants it needs.
2. Create `/components/[name].css` defining the base class and all variants using `var(--*)` tokens only. No hardcoded hex values.
3. Add `@import './[name].css';` to `components/index.css` at the correct position (after its dependencies, before components that depend on it).
4. Add the new component's class inventory to `.github/copilot-instructions.md` under "Available components".
5. Add a section for the new component to `gallery.html` showing every variant with labels.
6. Confirm completion with the class names added.

**Notes:**
- Use BEM double-dash modifier pattern for variants: `.component--variant`
- All values must use CSS custom properties from `base.css`
- If the component depends on another (e.g. a data-grid that builds on table), note the dependency in a CSS comment at the top of the file

---

## 7. preToolUse hook

### Purpose

Prevents Copilot from writing files outside `/screens/` and `/components/` during normal wireframe sessions. This protects `index.html`, `gallery.html`, `package.json`, `vite.config.js`, and all `.github/` configuration from accidental modification.

The `add-component` skill and explicit requests to update `copilot-instructions.md` are the only permitted exceptions — and those are handled by the skill instructions explicitly telling Copilot what it is allowed to touch.

### `.github/hooks/guard.json`

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/guard.sh",
        "timeoutSec": 10
      }
    ]
  }
}
```

### `scripts/guard.sh`

The hook script receives tool call details on stdin as JSON. It must:

1. Read stdin into a variable
2. Extract the tool name (e.g. `edit`, `write`, `shell`)
3. Extract the target file path if the tool is a file-writing tool (`edit`, `Write`, `MultiEdit`, `NotebookEdit`)
4. If the tool is a file-writing tool AND the target path does not begin with `screens/`, `./screens/`, `components/`, or `./components/`, output the deny JSON and exit with code 0
5. Otherwise output the allow JSON and exit with code 0

**Allow response:**
```json
{"permissionDecision": "allow"}
```

**Deny response:**
```json
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "Writes are only permitted in /screens/ and /components/. To modify project config or Copilot instructions, ask explicitly and confirm."
}
```

**Implementation notes:**
- Use `jq` if available; fall back to `grep`/`sed` pattern matching if not
- If stdin is empty or the tool type cannot be determined, default to allow (do not block unknown operations)
- The script must be executable (`chmod +x scripts/guard.sh`)
- Test with a dry run: `echo '{"tool":"edit","path":"index.html"}' | ./scripts/guard.sh`

---

## 8. `package.json`

```json
{
  "name": "ux-wireframe-sandpit",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "vite --open"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## 9. `README.md`

The README is the only documentation designers need to read. Write it to cover:

**One-time setup** (run by a developer)
```bash
npm install
chmod +x scripts/guard.sh
```

**Starting the canvas** (run every time)
```bash
npm start
```

Opens at `http://localhost:5173`. Keep the terminal running while you work.

**Starting Copilot** (in a second terminal)
```bash
copilot
```

**Example prompts** — include 8–10 realistic examples:
- "Create a login screen with email, password, and a forgot password link"
- "Add a user management screen with a table of users, status badges, and an invite button"
- "Create an analytics screen with 4 stat cards and a large empty chart area"
- "Add a settings screen with sidebar navigation and form sections for profile, notifications, and security"
- "Update the dashboard to show 6 stat cards instead of 4"
- "Add a delete confirmation modal to the users screen"
- "Create an onboarding screen with a 3-step progress indicator"
- "Add a notifications panel as a narrow right sidebar on the dashboard"

**Viewing the component gallery**
Navigate to `http://localhost:5173/gallery.html`

**Adding new components**
Tell Copilot: "Add a [component name] component with [variant] and [variant] variants"

**Useful Copilot CLI commands**
- `/plan` — ask Copilot to outline its approach before making changes
- `/diff` — review changes before accepting
- `/clear` — start a fresh conversation
- `/skills` — see available skills in this project
- `/model` — switch AI model (default is fine; use Claude Sonnet for complex layouts)

---

## 10. Implementation checklist for Claude Code

Implement in this order:

- [ ] `package.json`
- [ ] `vite.config.js` with `/api/screens` plugin
- [ ] `components/base.css` with full token set
- [ ] `components/layout.css`
- [ ] `components/utility.css`
- [ ] `components/top-nav.css`
- [ ] `components/sidebar.css`
- [ ] `components/button.css`
- [ ] `components/card.css`
- [ ] `components/table.css`
- [ ] `components/form.css`
- [ ] `components/badge.css`
- [ ] `components/modal.css`
- [ ] `components/tabs.css`
- [ ] `components/index.css`
- [ ] `screens/example.html`
- [ ] `gallery.html`
- [ ] `index.html` (canvas with auto-discovery and polling)
- [ ] `scripts/guard.sh` (set executable)
- [ ] `.github/hooks/guard.json`
- [ ] `.github/copilot-instructions.md`
- [ ] `.github/skills/create-screen/SKILL.md`
- [ ] `.github/skills/add-component/SKILL.md`
- [ ] `README.md`
- [ ] `SPEC.md` (this file, copy as-is)

After implementation, verify:
- `npm start` opens the canvas and `example.html` appears as a frame
- `http://localhost:5173/gallery.html` renders all component variants
- Creating a new file in `/screens/` causes it to appear in the canvas within ~3 seconds
- `scripts/guard.sh` correctly denies a write to `index.html` and allows a write to `screens/test.html`

---

## Appendix: design decisions and rationale

| Decision | Rationale |
|----------|-----------|
| No Tailwind | Named component classes are more reliable for AI generation — Copilot can reference `.btn--primary` explicitly rather than composing utility strings that may drift |
| No React/Vue | Screens are pure HTML — zero build complexity, zero framework knowledge required from designers |
| `index.css` + `@import` | Screens stay simple (one link tag). Component files stay focused. Adding a component is additive — no screen files change. |
| Auto-discovery via polling | Designers never touch `index.html`. New screens appear automatically 3 seconds after Copilot creates them. |
| Inline `<style>` blocks in screens | Screen-specific layout overrides are expected and acceptable. Forcing everything into global classes would bloat `components/` with one-off rules. |
| preToolUse hook | Protects project config from accidental Copilot edits during normal wireframe sessions without requiring `--allow-tool` flags on every run. |
| Token layer in `base.css` | Placeholder values ship with the project. When the team ports their Angular Material design system, they replace token values in one file and every component updates automatically. |
| 1280×720 frame size | Standard 16:9 desktop viewport. Comfortable at 25% zoom (320px wide) — fits 3–4 screens on a typical monitor. Scales cleanly to 50% for detail review. |
