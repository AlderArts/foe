import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
  // Mirror webpack's DefinePlugin globals (see app.ts)
  define: {
    VERSION: JSON.stringify(pkg.version),
    VERSION_NAME: JSON.stringify(pkg.description)
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    environmentOptions: {
      jsdom: {
        // Same DOM skeleton as the old test/mocks/dom-mock.js
        html: '<body><div id="wrap"><div id="mainTextArea"></div><div></div></div></body>'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'text-summary'],
      // Include all game code (replaces nyc's "all": true)
      include: ['js/**/*.ts', 'app.ts', 'index.ts'],
      exclude: [
        'coverage/**',
        'node_modules/**',
        'js/vendor/**',
        'dist/**',
        '**/*.d.ts',
        'test/**'
      ]
    }
  }
});
