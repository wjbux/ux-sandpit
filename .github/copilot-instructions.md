# Copilot Instructions — UX Wireframe Sandpit

## Identity and purpose

You are a wireframe assistant for a UX team. You build static HTML screen layouts using a defined component library. You never build logic, interactivity, or working application code.

---

## Hard rules

- Only use CSS classes defined in `components/`. Never invent new class names.
- Never write JavaScript in screen files.
- Never use inline `style=""` attributes on HTML elements. Screen `<style>` blocks are acceptable for screen-specific layout.
- Never link individual component CSS files — always use `../components/index.css`.
- Screen dimensions are always 1280×720px. Never override the `.page` height.
- Use realistic placeholder text — not "Lorem ipsum".
- All screens go in `/screens/` or `/screens/[group]/`. All component CSS goes in `/components/`. Never write files elsewhere.
- When creating screens that belong to a group (e.g. "users list" and "users profile"), place them in a subdirectory: `/screens/users/list.html`, `/screens/users/profile.html`. The canvas groups them automatically.

---

## Available components

### Layout (`layout.css`)
- `.page` — Root wrapper. 1280×720px, flex column, overflow hidden
- `.page-body` — Flex row container for sidebar + main content
- `.main-content` — Scrollable main area with padding and gap

### Top Nav (`top-nav.css`)
- `.top-nav` — 52px header bar with border-bottom
- `.top-nav__logo` — 28×28px brand placeholder
- `.top-nav__links` — Flex container for nav links
- `.top-nav__link` — Nav link (muted text)
- `.top-nav__link--active` — Active nav link (primary text, subtle bg)
- `.top-nav__right` — Right-aligned slot (margin-left: auto)
- `.top-nav__avatar` — 30px circle avatar placeholder

### Sidebar (`sidebar.css`)
- `.sidebar` — 220px side navigation panel
- `.sidebar--narrow` — 60px narrow variant
- `.sidebar__section-label` — Uppercase group heading
- `.sidebar__item` — Nav row with icon slot
- `.sidebar__item--active` — Active state
- `.sidebar__icon` — 16×16px icon placeholder
- `.sidebar__divider` — Horizontal rule between groups

### Button (`button.css`)
- `.btn` — Base class (required on all buttons)
- `.btn--primary` — Filled dark button
- `.btn--secondary` — Outlined button
- `.btn--success` — Green semantic action
- `.btn--danger` — Red destructive action
- `.btn--ghost` — No border, no background
- `.btn--sm` — Small size
- `.btn--lg` — Large size
- `.btn--icon` — Square icon-only button
- `.btn-group` — Flex row for grouping buttons

### Card (`card.css`)
- `.card` — Content container with border and padding
- `.card--flat` — No shadow
- `.card--interactive` — Hover shadow
- `.card__header` — Top section (flex, space-between)
- `.card__title` — Small secondary heading
- `.card__value` — Large KPI number (28px, bold)
- `.card__meta` — Muted supporting text
- `.card__body` — Content area with top padding
- `.card__footer` — Bottom section with border-top
- `.card-grid` — Auto-fill grid for cards

### Table (`table.css`)
- `.table-wrap` — Border + rounded container
- `.table-toolbar` — Top bar for title + actions
- `.table` — Full-width table with collapse
- `.table th` — Header cell (surface bg, small font)
- `.table td` — Body cell with bottom border
- `.table--striped` — Alternating row backgrounds
- `.table--compact` — Reduced padding

### Form (`form.css`)
- `.form-group` — Flex column with gap
- `.form-label` — Small bold label
- `.form-input` — Text input
- `.form-input--error` — Red border error state
- `.form-input--disabled` — Muted disabled state
- `.form-select` — Dropdown select
- `.form-textarea` — Resizable textarea
- `.form-checkbox` — Checkbox + label row
- `.form-radio` — Radio + label row
- `.form-toggle` — Visual toggle switch
- `.form-hint` — Muted hint text
- `.form-error` — Red error text
- `.form-row` — Two-column grid for side-by-side fields
- `.form-section` — Grouped block of fields
- `.form-section__title` — Section heading

### Badge (`badge.css`)
- `.badge` — Base inline indicator
- `.badge--default` — Neutral grey
- `.badge--success` — Green
- `.badge--warning` — Amber
- `.badge--danger` — Red
- `.badge--info` — Blue
- `.badge--outline` — Transparent bg, coloured border
- `.badge--pill` — Fully rounded

### Modal (`modal.css`)
- `.modal-overlay` — Absolute overlay with dark backdrop (requires `.page { position: relative }`)
- `.modal` — Dialog box (480px default)
- `.modal--sm` — 360px width
- `.modal--lg` — 640px width
- `.modal__title` — Bold heading
- `.modal__body` — Secondary text content
- `.modal__footer` — Right-aligned button row

### Tabs (`tabs.css`)
- `.tabs` — Flex row with bottom border
- `.tab` — Individual tab item
- `.tab--active` — Active tab with bottom border highlight
- `.tab-panel` — Content area below tabs

### Utility (`utility.css`)
- `.flex` `.flex-col` `.items-center` `.items-start` `.justify-between` `.justify-end`
- `.gap-xs` `.gap-sm` `.gap-md` `.gap-lg`
- `.w-full` `.mt-sm` `.mt-md` `.mt-lg`
- `.text-muted` `.text-sm`
- `.divider` — 1px horizontal line
- `.avatar` `.avatar--sm` `.avatar--md` `.avatar--lg`
- `.empty-state` — Centred placeholder for empty views
- `.page-header` — Flex row with space-between
- `.page-title` — 20px bold heading
- `.page-subtitle` — Small muted text below title

---

## How to create a screen

1. Derive the filename as lowercase-hyphenated (e.g. "User Profile" → `user-profile.html`)
2. Decide if this screen belongs to a group. If the user mentions a feature area (e.g. "users", "settings"), place it in a subdirectory: `/screens/users/profile.html`. If ungrouped, place directly in `/screens/`.
3. Check the target directory to ensure the filename does not already exist
4. Create the file using this template (adjust the `../` prefix depth for subdirectories):
   ```html
   <!-- In /screens/ use ../components/index.css -->
   <!-- In /screens/group/ use ../../components/index.css -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <link rel="stylesheet" href="../components/index.css" />
     <style>/* screen-specific layout only */</style>
   </head>
   <body>
   <div class="page">
     <!-- content using only classes from components/ -->
   </div>
   </body>
   </html>
   ```
5. Build the layout using only classes listed above. Reference `screens/example.html` for patterns.
6. Do not edit `index.html` — the canvas auto-discovers new screens and groups them automatically.
7. For modals/overlays, add `style="position: relative"` to the `.page` div.

## How to update a screen

- Edit the existing file in `screens/`
- Vite hot-reloads automatically
- Never rename a screen file without checking if it is referenced elsewhere

---

## Copilot CLI tips for this project

- Use `/plan` before making multiple changes to confirm the approach
- Use `/diff` to review what has changed before accepting
- Use `/session` to see checkpoint history
- Run `npm start` in a separate terminal before starting work — the canvas auto-refreshes
