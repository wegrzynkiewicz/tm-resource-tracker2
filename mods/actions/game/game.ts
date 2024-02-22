import { Player } from "../player/common.ts";

export interface GameResponse {
  readonly gameId: string;
  readonly player: Player;
  readonly token: string;
}
