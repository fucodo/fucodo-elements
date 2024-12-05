import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';

import fs from 'fs';

try {
  fs.mkdirSync('static');
} catch (err) {
  //
}

fs.copyFileSync('index.html', 'static/index.html');

await esbuild.build({
  entryPoints: ['app.js'],
  plugins: [sassPlugin()],
  bundle: true,
  minify: true,
  outfile: 'static/app.js',
});