---
description: Create a new wireframe screen using Angular Material components
triggers:
  - create a screen
  - add a screen
  - new screen
  - build a * screen
---

# Create Screen

Creates a new Angular Material wireframe screen component.

## Steps

1. **Confirm the screen name.** If not provided, ask. Derive the folder/file name as lowercase-hyphenated (e.g. "User Profile" → `user-profile`).

2. **Check for a reference image.** Ask the user if they have a reference image. If yes, read it from `assets/references/` — the user will tell you the filename. Study the layout, component arrangement, and content in the image before building the template. Match the structure as closely as possible using Angular Material components.

3. **Decide on grouping.** If the screen belongs to a feature area (e.g. "users", "settings"), place it in `src/app/screens/[group]/[name]/`. Create the subdirectory if needed. If ungrouped, place in `src/app/screens/[name]/`.

4. **Check for conflicts.** Ensure the folder does not already exist.

5. **Create the component file** (`[name].ts`):
   ```typescript
   import { Component } from '@angular/core';
   import { SCREEN_IMPORTS } from '../screen-imports'; // or ../../screen-imports for grouped

   @Component({
     selector: 'screen-[name]',
     imports: [...SCREEN_IMPORTS],
     templateUrl: './[name].html',
     styles: `/* screen-specific layout only */`,
   })
   export default class [Name]Screen {}
   ```

6. **Create the template file** (`[name].html`):
   - Wrap everything in `<div class="screen">`
   - Use Angular Material components only (see copilot-instructions.md for the full list)
   - Use `@if` / `@for` control flow, never `*ngIf` / `*ngFor`
   - Use realistic placeholder content
   - If a reference image was provided, replicate its layout and structure
   - Reference `src/app/screens/example/example.html` for patterns

7. **Add a route** to `src/app/app.routes.ts`:
   ```typescript
   { path: 'screen/[path]', loadComponent: () => import('./screens/[path]/[name]') },
   ```

8. **Add a registry entry** to `src/app/screens/screen-registry.ts`:
   ```typescript
   { path: '[path]', label: '[Label]', group: '[Group]' | null },
   ```

9. **Confirm completion** with the file path, route, and a brief description.

## Reference image workflow

Users cannot paste images directly into chat. Instead they save reference screenshots to `assets/references/` and tell you the filename. Always read the image file before building the screen — do not guess what it contains.

Example prompts:
- "Create a settings screen based on assets/references/settings.png"
- "Build a user profile screen — reference image is assets/references/user-profile.png"

## Notes

- For modals/dialogs, render the dialog content inline in the template (no MatDialog service)
- For static table data, define the array inline in the template's `[dataSource]`
- Always use `default export` on screen components
- Visit `/gallery` for a visual reference of available Material components
