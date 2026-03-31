export interface ScreenEntry {
  path: string;
  label: string;
  group: string | null;
}

/**
 * Master list of all screens. The canvas reads this to render frames.
 * When adding a new screen, add an entry here AND a route in app.routes.ts.
 */
export const SCREENS: ScreenEntry[] = [
  { path: 'example', label: 'Example', group: null },

  // === Add screens here ===
  // { path: 'users/list', label: 'User List', group: 'Users' },
  // { path: 'users/profile', label: 'User Profile', group: 'Users' },
];
