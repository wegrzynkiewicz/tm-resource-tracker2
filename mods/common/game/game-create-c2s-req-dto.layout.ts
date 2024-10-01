import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";
import { colorLayout } from "../color/color.layout.ts";
import { playerNameLayout } from "../player/player-dto.layout.ts";

export const gameCreateC2SReqDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseGameCreateC2SReqDTO",
  layout: new ObjectLayout({
    type: "GameCreateC2SReqDTO",
    properties: {
      color: colorLayout,
      name: playerNameLayout,
    },
  }),
});

import.meta.main && await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameCreateC2SReqDTOLayout]);
