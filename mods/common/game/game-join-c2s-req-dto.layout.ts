import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";
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

import.meta.main && await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameJoinC2SReqDTOLayout]);
