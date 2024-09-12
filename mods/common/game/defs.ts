import { playerLayout } from "../player/common.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { InferLayout } from "@acme/layout/common.ts";

export const gameLayout = new ObjectLayout(
  { summary: "Game object" },
  {
    gameId: new StringLayout({ summary: "Game identifier" }),
    player: playerLayout,
    token: new StringLayout({ summary: "Token" }),
  },
  []
);

export type GameDTO = InferLayout<typeof gameLayout>;
