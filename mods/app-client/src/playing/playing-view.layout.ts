import { compileLayouts } from "@framework/layout/defs.ts";
import { EnumLayout } from "@framework/layout/types/enum-layout.ts";
import { StandaloneLayout } from "@framework/layout/types/standalone-layout.ts";

export const playingViewLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayingView",
  layout: new EnumLayout({
    name: "playingView",
    type: "PlayingView",
    description: "The view of the playing screen",
    values: ["resources", "projects", "histories", "settings"],
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [playingViewLayout]);
}
