import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { playerLayout } from "../player/player.layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const gameDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseGameDTO",
  layout: new ObjectLayout({
    type: "GameDTO",
    description: "Game",
    properties: {
      gameId: new StringLayout({
        description: "Game identifier"
      }),
      player: playerLayout,
      token: new StringLayout({
        description: "Token"
      }),
    },
  }),
});

await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameDTOLayout]);
