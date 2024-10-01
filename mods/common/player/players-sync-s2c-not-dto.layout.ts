import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { ArrayLayout } from "@acme/layout/types/array-layout.ts";
import { playerDTOLayout } from "./player-dto.layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const playersSyncS2CNotDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayersSyncS2CNotDTO",
  layout: new ObjectLayout({
    type: "PlayersSyncS2CNotDTO",
    properties: {
      players: new ArrayLayout({
        items: playerDTOLayout,
      }),
    },
  }),
});

import.meta.main && await compileLayouts(`@acme/layout/runtime/mod.ts`, [playersSyncS2CNotDTOLayout]);