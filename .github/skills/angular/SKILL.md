---
description: Angular 21 conventions for the wireframe sandpit project
---

# Angular Skill — Wireframe Sandpit

## Component patterns

- Angular 21: standalone is the default — do NOT set `standalone: true`
- Use `@if` / `@for` control flow — never `*ngIf` or `*ngFor`
- Use `inject()` for DI — never constructor injection
- Signals for any local state: `signal()`, `computed()`
- Default export on all screen components (enables lazy loading)

### Screen component

```typescript
import { Component } from '@angular/core';
import { SCREEN_IMPORTS } from '../screen-imports';

@Component({
  selector: 'screen-example',
  imports: [...SCREEN_IMPORTS],
  templateUrl: './example.html',
  styles: `/* screen-specific layout only */`,
})
export default class ExampleScreen {}
```

### Templates

```html
@if (condition) {
  <p>Content</p>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

## Angular Material usage

- All Material modules are available via `SCREEN_IMPORTS` — never import individually
- Use `appearance="outline"` on `<mat-form-field>` for consistent styling
- Use `<mat-icon>icon_name</mat-icon>` with Material Icons font
- Button directives: `mat-flat-button`, `mat-raised-button`, `mat-stroked-button`, `mat-button`, `mat-icon-button`, `mat-fab`, `mat-mini-fab`
- Colors: `color="primary"`, `color="accent"`, `color="warn"`

## Project-specific rules

- Screens are visual wireframes only — no logic, services, or state management
- Screen dimensions: 1280×720px via the `.screen` CSS class
- Realistic placeholder content — never "Lorem ipsum"
- All screens in `src/app/screens/`
- Every screen needs a route in `app.routes.ts` and entry in `screen-registry.ts`
