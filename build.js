import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin'

import { readdir, stat } from 'fs/promises';
import path from 'path';

const packagesDir = './packages';

const entries = await readdir(packagesDir);

for (const entry of entries) {
  const packagePath = path.join(packagesDir, entry);
  const stats = await stat(packagePath);

  if (stats.isDirectory()) {
    const entryFile = path.join(packagePath, 'index.js');

    try {
      await build({
        entryPoints: [entryFile],
        bundle: true,
        minify: false,
        outdir: path.join(packagePath, 'dist'),
        platform: 'browser',
        loader: {
          '.svg': 'text'
        },
        plugins: [sassPlugin({ type: 'css-text' })],
      });
      console.log(`Built ${entry}`);
    } catch (err) {
      console.error(`Failed to build ${entry}:`, err);
    }
  }
}