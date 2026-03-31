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

## Example prompts

- "Create a login screen with email, password, and a forgot password link"
- "Add a user management screen with a table of users, status badges, and an invite button"
- "Create an analytics screen with 4 stat cards and a large empty chart area"
- "Add a settings screen with sidebar navigation and form sections for profile, notifications, and security"
- "Update the dashboard to show 6 stat cards instead of 4"
- "Add a delete confirmation modal to the users screen"
- "Create an onboarding screen with a 3-step progress indicator"
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
