import { Breaker } from "../../common/asserts.ts";
import { GADefinition } from "../../common/communication/define.ts";
import { Player } from "../player/common.ts";

export interface PlayingGame {
  players: Player[];
  initPoints: number;
}

export function providePlayingGame(): PlayingGame {
  throw new Breaker('playing-game-must-be-injected');
}

export type PlayingGameGA = PlayingGame;

export const playingGameGADef: GADefinition<PlayingGameGA> = {
  kind: 'playing-game',
};
