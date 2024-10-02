import { compileLayouts } from "@acme/layout/defs.ts";
import { EnumLayout } from "@acme/layout/types/enum-layout.ts";
import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";

export const playingViewLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayingView",
  layout: new EnumLayout({
    name: "playingView",
    type: "PlayingView",
    description: "The view of the playing screen",
    values: ["supplies", "projects", "histories", "settings"],
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [playingViewLayout]);
}
