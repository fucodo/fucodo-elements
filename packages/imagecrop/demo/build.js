import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';

import fs from 'fs';

try {
  fs.mkdirSync('build');
} catch (err) {
  //
}

fs.copyFileSync('src/index.html', 'build/index.html');

await esbuild.build({
  entryPoints: ['src/app.js'],
  plugins: [sassPlugin()],
  bundle: true,
  minify: true,
  outfile: 'build/app.js',
});