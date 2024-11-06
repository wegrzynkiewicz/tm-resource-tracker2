import { StandaloneLayout } from "@framework/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@framework/layout/types/object-layout.ts";
import { compileLayouts } from "@framework/layout/defs.ts";
import { gameIdLayout } from "./game-dto.layout.ts";
import { colorLayout } from "../color/color.layout.ts";
import { playerNameLayout } from "../player/player-dto.layout.ts";

export const gameJoinC2SReqDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseGameJoinC2SReqDTO",
  layout: new ObjectLayout({
    type: "GameJoinC2SReqDTO",
    properties: {
      color: colorLayout,
      gameId: gameIdLayout,
      name: playerNameLayout,
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameJoinC2SReqDTOLayout]);
}
