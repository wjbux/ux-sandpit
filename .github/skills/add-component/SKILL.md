---
description: Add a custom wireframe component based on a reference image
triggers:
  - add a component
  - new component
  - we need a * component
  - add * to the component library
  - create a component from
---

# Add Component

Creates a custom Angular component for use in wireframe screens, based on a reference image or description. Use this when Angular Material doesn't have a built-in equivalent for what the user needs (e.g. a custom dashboard widget, a specific card layout, a branded header).

## Steps

1. **Read the reference image.** The user will place a screenshot in `assets/references/` and tell you the filename. Read the image file before doing anything else — do not guess what it contains. If no image is provided, ask the user to describe the component or provide one.

2. **Confirm the component name and variants.** Based on the image and user description, identify:
   - The component name (lowercase-hyphenated)
   - Any variants visible in the image (e.g. different states, sizes)
   - Sub-elements that need their own styling

3. **Create the component** in `src/app/screens/_shared/[name]/`:
   ```
   src/app/screens/_shared/[name]/
     [name].ts
     [name].html
   ```

   The component should:
   - Be standalone (Angular 21 default)
   - Import only what it needs from `@angular/material/*` plus `SCREEN_IMPORTS` if it composes Material components
   - Use `input()` signals for any configurable properties
   - Have no logic — visual only
   - Use inline `styles` for component-specific CSS

4. **Export from a barrel file.** Create or update `src/app/screens/_shared/index.ts`:
   ```typescript
   export { MyComponent } from './my-component/my-component';
   ```

5. **Add to SCREEN_IMPORTS.** Add the new component to `src/app/screens/screen-imports.ts` so all screens can use it without extra imports.

6. **Add to the gallery.** Add a section to `src/app/gallery/gallery.html` showing the component and its variants with labels.

7. **Update copilot-instructions.md.** Add the component to the "Available Angular Material components" section so future screen creation knows about it.

8. **Confirm completion** with the component selector, inputs, and usage example.

## Reference image workflow

Users cannot paste images directly into chat. Instead they save reference screenshots to `assets/references/` and tell you the filename. Always read the image file first.

Example prompts:
- "Add a stat card component based on assets/references/stat-card.png"
- "Create a branded header component — reference is assets/references/header.png"
- "We need a timeline component, reference image is in assets/references/timeline.png"

## Notes

- Only create custom components when Angular Material doesn't cover it
- Use Angular Material components internally where possible (e.g. `mat-card` as a base for a custom card variant)
- All values should use the Angular Material theme — avoid hardcoded colours
- Keep components simple and visual-only — no services, no state, no HTTP
