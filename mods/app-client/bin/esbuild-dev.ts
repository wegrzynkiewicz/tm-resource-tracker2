import * as esbuild from "npm:esbuild";
import config from "../../../deno.json" with { type: "json" };
import httpFetch from "https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js";
import { importMapPlugin } from "jsr:@miyauci/esbuild-import-map@^1.2.0";

const regex = /\.dynamic\.ts$/;
const dynamicOverridePlugin: esbuild.Plugin = {
  name: "dynamic-override",
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
};

const addPureAnnotation: esbuild.Plugin = {
  name: "add-pure-annotation",
  setup(build) {
    build.onLoad({ filter: /.ts/ }, async (args) => {
      const file = await Deno.readTextFile(args.path);
      const contents = file.replaceAll(/= define/g, "= /** @__PURE__ */ define");
      return { contents, loader: "default" };
    });
  },
};

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: [
    "mods/app-client/src/entry.ts",
    "mods/app-client/styles/entry.css",
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
    addPureAnnotation,
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
  fallback: "mods/app-client/public/index.html",
});
console.log(`Serving on http://localhost:${port}`);
