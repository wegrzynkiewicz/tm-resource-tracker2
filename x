#!/bin/bash

function check() {
  deno fmt mods
  deno test
  deno lint
  deno check mods/app-server/server-entry.ts
  deno check mods/app-client/entry.ts
}

function layout() {
  find . -name "*.layout.ts" | xargs -L 1 -P 8 deno run -A
  find . -name "*.layout.compiled.ts" | xargs -L 1 -P 8 -I {} bash -c "deno fmt {} &> /dev/null"
}

function serve() {
    deno run --allow-all --watch mods/app-client/bin/esbuild-dev.ts
}

function server() {
    deno run --allow-all --check --watch mods/app-server/server-entry.ts
}

"${@}"
