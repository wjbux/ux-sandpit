import { Component } from '@angular/core';
import { SCREEN_IMPORTS } from '../screen-imports';

@Component({
  selector: 'screen-example',
  imports: [...SCREEN_IMPORTS],
  templateUrl: './example.html',
  styles: `
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat-value { font-size: 28px; font-weight: 600; margin: 8px 0 4px; }
    .stat-meta { font-size: 12px; color: #888; }
  `,
})
export default class ExampleScreen {}
