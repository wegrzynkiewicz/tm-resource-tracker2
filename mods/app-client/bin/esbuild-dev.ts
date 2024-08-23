import * as esbuild from 'npm:esbuild'
import config from "../../deno.json" with {type: "json"};
import httpFetch from 'https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js'
import { importMapPlugin } from "jsr:@miyauci/esbuild-import-map@^1.2.0";

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: [
    'app-client/entry.ts',
    'app-client/entry.css',
  ],
  format: 'esm',
  loader: {
    '.woff2': 'empty',
    '.css': 'css',
    '.jpg': 'copy',
    '.png': 'copy',
  },
  metafile: true,
  minify: true,
  outdir: 'app-client/public/dist',
  plugins: [
    httpFetch,
    importMapPlugin({
      importMap: config,
      url: import.meta.resolve("../../deno.json"),
    }),
  ],
  splitting: true,
  supported: {
    'import-attributes': true,
  },
  treeShaking: true,
})

const { host, port } = await ctx.serve({
  servedir: 'app-client/public/',
});
console.log(`Serving on http://${host}:${port}`);
