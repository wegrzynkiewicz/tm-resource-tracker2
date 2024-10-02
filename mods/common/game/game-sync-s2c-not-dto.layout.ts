import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";
import { playersDTOLayout } from "../player/players-sync-s2c-not-dto.layout.ts";

export const gameSyncS2CNotDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseGameSyncS2CNotDTO",
  layout: new ObjectLayout({
    type: "GameSyncS2CNotDTO",
    properties: {
      players: playersDTOLayout,
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameSyncS2CNotDTOLayout]);
}
