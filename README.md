# UX Wireframe Sandpit

A local wireframe prototyping tool for UX teams. Describe screens in plain English via GitHub Copilot CLI — a browser canvas displays the results using real Angular Material components.

**Stack:** Angular 21, Angular Material, Angular CDK

## One-time setup

```bash
npm install
chmod +x scripts/guard.sh
```

## Starting the canvas

```bash
npm start
```

Opens at `http://localhost:4200`. Keep the terminal running while you work.

## Starting Copilot

In a second terminal:

```bash
copilot
```

## Screen grouping

Screens in `src/app/screens/` appear as "Ungrouped" on the canvas. Group related screens in subdirectories:

```
src/app/screens/
  example/            ← ungrouped
  users/
    list/             ← "Users" group
    profile/
  settings/
    general/          ← "Settings" group
    security/
```

Click any screen on the canvas to view it fullscreen (Escape to close).

## Example prompts

- "Create a login screen with email, password, and a forgot password link"
- "Add a users list screen and a users profile screen"
- "Create an analytics screen with 4 stat cards and a chart placeholder"
- "Add a settings group with general, notifications, and security screens"
- "Update the dashboard to show 6 stat cards instead of 4"
- "Add a delete confirmation dialog to the users list screen"
- "Create an onboarding group with welcome and setup screens"
- "Add a notifications panel as a narrow right sidebar on the dashboard"

## Viewing the component gallery

Navigate to `http://localhost:4200/gallery`

## Applying your theme

1. Remove `@angular/material/prebuilt-themes/azure-blue.css` from `angular.json` styles
2. Add your custom theme to `src/styles.scss` (placeholder instructions are in the file)

## Useful Copilot CLI commands

- `/plan` — outline approach before making changes
- `/diff` — review changes before accepting
- `/clear` — start a fresh conversation
- `/skills` — see available skills
