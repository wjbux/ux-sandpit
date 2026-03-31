# Component Extraction Prompt for Microsoft Copilot

Copy everything below the line into Microsoft Copilot, then attach your screenshot.

---

I'm building a CSS component library for a wireframe prototyping tool. I need you to analyse the attached screenshot and produce a structured component definition I can hand to a coding assistant.

**My component library uses these conventions:**
- BEM-style naming: `.component` for base, `.component--variant` for modifiers, `.component__element` for children
- All colours/spacing/radii/fonts reference CSS custom properties (e.g. `var(--color-primary)`, `var(--space-md)`, `var(--radius-lg)`)
- No hardcoded hex values, no JavaScript, no inline styles
- Components are pure CSS — visual only, no interactivity

**Available design tokens:**
```
Colors: --color-primary, --color-primary-hover, --color-primary-text, --color-bg, --color-bg-surface, --color-bg-elevated, --color-border, --color-border-strong, --color-text-primary, --color-text-secondary, --color-text-muted, --color-success, --color-success-bg, --color-warning, --color-warning-bg, --color-danger, --color-danger-bg, --color-info, --color-info-bg
Spacing: --space-xs (4px), --space-sm (8px), --space-md (16px), --space-lg (24px), --space-xl (40px)
Typography: --font-sans, --font-size-xs (11px), --font-size-sm (12px), --font-size-base (14px), --font-size-md (16px), --font-size-lg (20px)
Radii: --radius-sm (5px), --radius-md (7px), --radius-lg (10px), --radius-xl (14px), --radius-full (9999px)
Elevation: --shadow-sm, --shadow-md
```

**From the screenshot, produce this exact output format:**

```
COMPONENT NAME: [name]
FILENAME: [name].css

CLASS INVENTORY:
- .[name] — [what the base class does, key CSS properties]
- .[name]--[variant] — [what this variant changes]
- .[name]__[element] — [what this child element does]
(list every class needed)

DEPENDENCIES: [none, or list other components this builds on]

EXAMPLE HTML:
<div class="[name]">
  [minimal realistic HTML showing the component in use with all key elements]
</div>

VARIANT EXAMPLES:
[one HTML snippet per variant, showing how modifier classes are applied]
```

**Rules for your analysis:**
- Name classes based on what the component IS, not what it looks like (e.g. `.card` not `.rounded-box`)
- If you see multiple visual states (hover, active, selected, error), define each as a `--variant` modifier
- If the component has distinct sub-parts (header, body, footer, icon, label), define each as a `__element`
- Use the design tokens above — pick the closest match for colours, spacing, and sizes
- Keep it practical: only define classes that are genuinely useful, don't over-decompose
- If the screenshot shows the component in context (e.g. inside a page), focus only on the component itself

**Additional context from me:** [ADD YOUR DESCRIPTION HERE — e.g. "This is a data table with sortable headers and row selection" or "This is the notification toast that appears top-right"]
