---
description: Create a new wireframe screen in the sandpit project
triggers:
  - create a screen
  - add a screen
  - new screen
  - build a * screen
---

# Create Screen

Creates a new static HTML wireframe screen using the project's component library.

## Steps

1. **Confirm the screen name.** If the user didn't provide one, ask. Derive the filename as lowercase-hyphenated (e.g. "User Profile" → `user-profile.html`).

2. **Check for conflicts.** Read `/screens/` to ensure the filename does not already exist. If it does, ask the user whether to overwrite or choose a different name.

3. **Create the file.** Create `/screens/[name].html` using the standard template:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <link rel="stylesheet" href="../components/index.css" />
     <style>/* screen-specific layout only */</style>
   </head>
   <body>
   <div class="page">
     <!-- content here -->
   </div>
   </body>
   </html>
   ```

4. **Build the layout.** Use only classes from `components/`. Use the user's description to decide which components to include. Reference `screens/example.html` for structural patterns.

5. **Do not edit `index.html`** — the canvas auto-discovers screens via `/api/screens`.

6. **Confirm completion** with the filename and a brief description of what was built.

## Notes

- If the user says "like the example screen but with X" — read `screens/example.html` first, then adapt.
- If the user asks for a modal or overlay, add `style="position: relative"` to the `.page` div.
- Always use realistic content in placeholders — real-looking names, numbers, labels. Never use "Lorem ipsum".
- Never write JavaScript in screen files.
- Never use inline `style=""` attributes — use component classes or the screen `<style>` block.
