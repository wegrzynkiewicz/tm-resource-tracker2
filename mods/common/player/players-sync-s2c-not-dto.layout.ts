import { StandaloneLayout } from "@framework/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@framework/layout/types/object-layout.ts";
import { ArrayLayout } from "@framework/layout/types/array-layout.ts";
import { playerDTOLayout } from "./player-dto.layout.ts";
import { compileLayouts } from "@framework/layout/defs.ts";

export const playersDTOLayout = new ArrayLayout({
  items: playerDTOLayout,
});

export const playersSyncS2CNotDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayersSyncS2CNotDTO",
  layout: new ObjectLayout({
    type: "PlayersSyncS2CNotDTO",
    properties: {
      players: playersDTOLayout,
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [playersSyncS2CNotDTOLayout]);
}
