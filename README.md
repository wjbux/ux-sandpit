# UX Wireframe Sandpit

A local wireframe prototyping tool for UX teams. Describe screens in plain English via GitHub Copilot CLI — a browser canvas displays the results as frames, similar to Figma's canvas.

**Stack:** Vite (dev server), vanilla HTML/CSS, no frontend framework.

## One-time setup

```bash
npm install
chmod +x scripts/guard.sh
```

## Starting the canvas

```bash
npm start
```

Opens at `http://localhost:5173`. Keep the terminal running while you work.

## Starting Copilot

In a second terminal:

```bash
copilot
```

## Screen grouping

Screens in `/screens/` appear as "Ungrouped" on the canvas. To group related screens, put them in a subdirectory:

```
screens/
  example.html              ← ungrouped
  users/
    list.html               ← "Users" group
    profile.html
  settings/
    general.html            ← "Settings" group
    security.html
```

Groups are collapsible on the canvas. Click any screen to view it fullscreen (press Escape or click outside to close).

## Example prompts

- "Create a login screen with email, password, and a forgot password link"
- "Add a users list screen and a users profile screen" *(creates screens/users/list.html and profile.html)*
- "Create an analytics screen with 4 stat cards and a large empty chart area"
- "Add a settings group with general, notifications, and security screens"
- "Update the dashboard to show 6 stat cards instead of 4"
- "Add a delete confirmation modal to the users list screen"
- "Create an onboarding group with a welcome screen and a setup screen"
- "Add a notifications panel as a narrow right sidebar on the dashboard"

## Viewing the component gallery

Navigate to `http://localhost:5173/gallery.html`

## Adding new components

Tell Copilot: "Add a [component name] component with [variant] and [variant] variants"

## Useful Copilot CLI commands

- `/plan` — ask Copilot to outline its approach before making changes
- `/diff` — review changes before accepting
- `/clear` — start a fresh conversation
- `/skills` — see available skills in this project
- `/model` — switch AI model (default is fine; use Claude Sonnet for complex layouts)
