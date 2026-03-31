import { Component } from '@angular/core';
import { SCREEN_IMPORTS } from '../screens/screen-imports';

@Component({
  selector: 'app-gallery',
  imports: [...SCREEN_IMPORTS],
  templateUrl: './gallery.html',
  styles: `
    :host { display: block; padding: 40px 60px; max-width: 1200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    .subtitle { font-size: 13px; color: #888; margin-bottom: 40px; }
    section { margin-bottom: 48px; }
    section h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
    section p { font-size: 13px; color: #888; margin-bottom: 20px; }
    .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
    .item { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
    .label { font-size: 11px; font-family: monospace; color: #999; }
    mat-divider { margin: 40px 0; }
    .preview { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; }
  `,
})
export default class GalleryComponent {}
