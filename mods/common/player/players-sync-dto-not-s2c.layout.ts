import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { ArrayLayout } from "@acme/layout/types/array-layout.ts";
import { playerDTOLayout } from "./player.layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const playerSyncDTONotS2CLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayerSyncDTONotS2C",
  layout: new ObjectLayout({
    type: "PlayerSyncDTONotS2C",
    properties: {
      players: new ArrayLayout({
        items: playerDTOLayout,
      }),
    },
  }),
});

await compileLayouts(`@acme/layout/runtime/mod.ts`, [playerSyncDTONotS2CLayout]);
