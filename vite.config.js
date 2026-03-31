import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function screensApiPlugin() {
  return {
    name: 'screens-api',
    configureServer(server) {
      server.middlewares.use('/api/screens', (req, res) => {
        const screensDir = path.resolve(__dirname, 'screens');
        let files = [];
        try {
          files = fs.readdirSync(screensDir).filter(f => f.endsWith('.html'));
        } catch {
          // screens directory missing or empty
        }
        const screens = files.map(f => {
          const name = f.replace('.html', '');
          const label = name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
          return { file: f, label };
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(screens));
      });
    }
  };
}

export default defineConfig({
  plugins: [screensApiPlugin()]
});
