---
description: Add a new CSS component to the wireframe component library
triggers:
  - add a component
  - new component
  - we need a * component
  - add * to the component library
---

# Add Component

Adds a new CSS component to the project's component library with all required integration points.

## Steps

1. **Confirm details.** Confirm the component name and what variants it needs with the user.

2. **Create the CSS file.** Create `/components/[name].css` defining the base class and all variants. Rules:
   - Use `var(--*)` tokens only — no hardcoded hex values
   - Use BEM double-dash modifier pattern for variants: `.component--variant`
   - If the component depends on another, note the dependency in a CSS comment at the top

3. **Update index.css.** Add `@import './[name].css';` to `components/index.css` at the correct position (after its dependencies, before components that depend on it).

4. **Update copilot-instructions.md.** Add the new component's class inventory to `.github/copilot-instructions.md` under "Available components", following the same format as existing entries.

5. **Update gallery.html.** Add a section for the new component to `gallery.html` showing every variant with labels, following the existing gallery section pattern.

6. **Confirm completion** with the class names added.

## Notes

- All values must reference CSS custom properties from `base.css`
- Follow existing naming conventions in the component library
- The gallery section should show realistic example content, not placeholder text
