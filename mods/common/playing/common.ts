import { Breaker } from "../../core/asserts.ts";
import { GADefinition } from "../../core/communication/define.ts";
import { Player } from "../player/player.layout.ts";

export interface PlayingGame {
  players: Player[];
  initPoints: number;
}

export function providePlayingGame(): PlayingGame {
  throw new Breaker("playing-game-must-be-injected");
}

export type PlayingGameGA = PlayingGame;

export const playingGameGADef: GADefinition<PlayingGameGA> = {
  name: "playing-game",
};
