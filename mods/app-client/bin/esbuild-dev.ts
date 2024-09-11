import * as esbuild from "npm:esbuild";
import config from "../../../deno.json" with { type: "json" };
import httpFetch from "https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js";
import { importMapPlugin } from "jsr:@miyauci/esbuild-import-map@^1.2.0";

const regex = /\.dynamic\.ts$/;
const dynamicOverridePlugin: esbuild.Plugin = {
  name: 'dynamic-override',
  setup(build) {
    build.onResolve({ filter: regex }, async (args) => {
      const { kind, path, resolveDir } = args;
      const newPath = path.replace(regex, "browser.ts");
      const result = await build.resolve(newPath, { kind, resolveDir });
      return {
        path: result.path,
        namespace: "file",
      };
    });
  },
}

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: [
    "mods/app-client/entry.ts",
    "mods/app-client/entry.css",
  ],
  external: [
    "/images/*.jpg",
    "/images/*.png",
  ],
  format: "esm",
  loader: {
    ".css": "css",
  },
  minify: false,
  outdir: "mods/app-client/public/dist",
  plugins: [
    dynamicOverridePlugin,
    httpFetch,
    importMapPlugin({
      importMap: config,
      url: import.meta.resolve("../../../deno.json"),
    }),
  ],
  splitting: true,
  treeShaking: true,
});

const { port } = await ctx.serve({
  servedir: "mods/app-client/public/",
});
console.log(`Serving on http://localhost:${port}`);
