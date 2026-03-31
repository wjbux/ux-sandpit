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

2. **Decide on grouping.** If the screen belongs to a feature area (e.g. "users", "settings"), place it in `src/app/screens/[group]/[name]/`. Create the subdirectory if needed. If ungrouped, place in `src/app/screens/[name]/`.

3. **Check for conflicts.** Ensure the folder does not already exist.

4. **Create the component file** (`[name].ts`):
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

5. **Create the template file** (`[name].html`):
   - Wrap everything in `<div class="screen">`
   - Use Angular Material components only (see copilot-instructions.md for the full list)
   - Use `@if` / `@for` control flow, never `*ngIf` / `*ngFor`
   - Use realistic placeholder content
   - Reference `src/app/screens/example/example.html` for patterns

6. **Add a route** to `src/app/app.routes.ts`:
   ```typescript
   { path: 'screen/[path]', loadComponent: () => import('./screens/[path]/[name]') },
   ```

7. **Add a registry entry** to `src/app/screens/screen-registry.ts`:
   ```typescript
   { path: '[path]', label: '[Label]', group: '[Group]' | null },
   ```

8. **Confirm completion** with the file path, route, and a brief description.

## Notes

- For modals/dialogs, render the dialog content inline in the template (no MatDialog service)
- For static table data, define the array inline in the template's `[dataSource]`
- Always use `default export` on screen components
- Visit `/gallery` for a visual reference of available Material components
