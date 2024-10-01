import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { playerDTOLayout } from "../player/player-dto.layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const gameIdLayout = new StringLayout({
  description: "Game identifier",
});

export const gameDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseGameDTO",
  layout: new ObjectLayout({
    type: "GameDTO",
    description: "Game",
    properties: {
      gameId: gameIdLayout,
      player: playerDTOLayout,
      token: new StringLayout({
        description: "Token",
      }),
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [gameDTOLayout]);
}
