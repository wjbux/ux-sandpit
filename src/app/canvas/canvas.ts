import { Component, signal, computed } from '@angular/core';
import { SCREENS, ScreenEntry } from '../screens/screen-registry';

interface ScreenGroup {
  name: string;
  label: string;
  screens: ScreenEntry[];
  collapsed: boolean;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.html',
  styles: `
    :host { display: flex; flex-direction: column; height: 100vh; background: #1a1a1a; color: #ccc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

    .toolbar { display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 0 24px; background: #2a2a2a; border-bottom: 1px solid #3a3a3a; flex-shrink: 0; }
    .toolbar__title { font-size: 14px; font-weight: 600; color: #eee; }
    .toolbar__count { font-size: 13px; color: #888; }
    .toolbar__zoom { display: flex; align-items: center; gap: 8px; }
    .toolbar__zoom button { width: 28px; height: 28px; border: 1px solid #444; border-radius: 4px; background: #333; color: #ccc; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .toolbar__zoom button:hover { background: #444; }
    .toolbar__zoom-level { font-size: 13px; color: #aaa; min-width: 40px; text-align: center; }

    .canvas { flex: 1; overflow: auto; padding: 40px 80px 60px; }

    .group { margin-bottom: 48px; }
    .group__header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 0; margin-bottom: 20px; user-select: none; }
    .group__arrow { font-size: 12px; color: #666; transition: transform 0.15s; }
    .group__arrow--collapsed { transform: rotate(-90deg); }
    .group__name { font-size: 13px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.06em; }
    .group__count { font-size: 12px; color: #555; }
    .group__screens { display: flex; gap: 60px; align-items: flex-start; flex-wrap: wrap; }

    .frame-wrapper { flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; cursor: pointer; }
    .frame-wrapper:hover .frame-container { box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 0 2px #555; }
    .frame-container { overflow: hidden; border-radius: 3px; box-shadow: 0 8px 30px rgba(0,0,0,0.4); transition: box-shadow 0.15s; }
    .frame-container iframe { display: block; width: 1280px; height: 720px; border: none; transform-origin: top left; background: #fff; pointer-events: none; }
    .frame-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }

    .fullscreen-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; flex-direction: column; }
    .fullscreen-bar { display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 0 24px; background: #1a1a1a; border-bottom: 1px solid #333; flex-shrink: 0; }
    .fullscreen-bar__label { font-size: 14px; font-weight: 500; color: #ccc; }
    .fullscreen-bar__close { width: 32px; height: 32px; border: 1px solid #444; border-radius: 4px; background: #333; color: #ccc; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .fullscreen-bar__close:hover { background: #444; }
    .fullscreen-body { flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 24px; }
    .fullscreen-body iframe { width: 1280px; height: 720px; border: none; background: #fff; border-radius: 3px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
  `,
})
export default class CanvasComponent {
  private readonly zoomSteps = [0.10, 0.15, 0.20, 0.25, 0.33, 0.50, 0.75, 1.00];
  protected readonly zoomIndex = signal(3);
  protected readonly scale = computed(() => this.zoomSteps[this.zoomIndex()]);
  protected readonly zoomLabel = computed(() => Math.round(this.scale() * 100) + '%');
  protected readonly frameWidth = computed(() => 1280 * this.scale() + 'px');
  protected readonly frameHeight = computed(() => 720 * this.scale() + 'px');
  protected readonly frameScale = computed(() => `scale(${this.scale()})`);

  protected readonly totalScreens = SCREENS.length;
  protected readonly groups: ScreenGroup[];

  protected readonly fullscreen = signal<ScreenEntry | null>(null);

  constructor() {
    const grouped = new Map<string, ScreenEntry[]>();
    for (const s of SCREENS) {
      const key = s.group ?? '_ungrouped';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(s);
    }

    this.groups = [];
    const ungrouped = grouped.get('_ungrouped');
    if (ungrouped) {
      this.groups.push({ name: '_ungrouped', label: 'Ungrouped', screens: ungrouped, collapsed: false });
      grouped.delete('_ungrouped');
    }
    for (const [name, screens] of grouped) {
      const label = name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      this.groups.push({ name, label, screens, collapsed: false });
    }
  }

  protected zoomOut(): void {
    if (this.zoomIndex() > 0) this.zoomIndex.update(i => i - 1);
  }

  protected zoomIn(): void {
    if (this.zoomIndex() < this.zoomSteps.length - 1) this.zoomIndex.update(i => i + 1);
  }

  protected toggleGroup(group: ScreenGroup): void {
    group.collapsed = !group.collapsed;
  }

  protected openFullscreen(screen: ScreenEntry): void {
    this.fullscreen.set(screen);
  }

  protected closeFullscreen(): void {
    this.fullscreen.set(null);
  }

  protected screenUrl(screen: ScreenEntry): string {
    return '/screen/' + screen.path;
  }
}
