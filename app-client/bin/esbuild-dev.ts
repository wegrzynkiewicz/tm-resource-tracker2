import * as esbuild from 'npm:esbuild'

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: [
    'app-client/entry.ts',
  ],
  format: 'esm',
  loader: {
    '.module.css': 'local-css',
    '.jpg': 'copy',
    '.png': 'copy',
  },
  metafile: true,
  minify: false,
  outdir: 'app-client/public/dist',
  splitting: true,
  treeShaking: true,
})

const { host, port } = await ctx.serve({
  servedir: 'app-client/public/',
});
console.log(`http://${host}:${port}/`);
