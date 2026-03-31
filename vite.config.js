import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function toLabel(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function screensApiPlugin() {
  return {
    name: 'screens-api',
    configureServer(server) {
      server.middlewares.use('/api/screens', (req, res) => {
        const screensDir = path.resolve(__dirname, 'screens');
        const groups = [];

        try {
          const entries = fs.readdirSync(screensDir, { withFileTypes: true });

          // Root-level screens (ungrouped)
          const rootFiles = entries
            .filter(e => e.isFile() && e.name.endsWith('.html'))
            .map(e => ({ file: e.name, label: toLabel(e.name.replace('.html', '')) }));
          if (rootFiles.length) {
            groups.push({ group: null, label: 'Ungrouped', screens: rootFiles });
          }

          // Subdirectory groups
          entries
            .filter(e => e.isDirectory())
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(dir => {
              const dirPath = path.join(screensDir, dir.name);
              const files = fs.readdirSync(dirPath)
                .filter(f => f.endsWith('.html'))
                .map(f => ({
                  file: dir.name + '/' + f,
                  label: toLabel(f.replace('.html', ''))
                }));
              if (files.length) {
                groups.push({ group: dir.name, label: toLabel(dir.name), screens: files });
              }
            });
        } catch {
          // screens directory missing
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(groups));
      });
    }
  };
}

export default defineConfig({
  plugins: [screensApiPlugin()]
});
