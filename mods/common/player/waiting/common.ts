import { GADefinition } from "../../../core/communication/define.ts";
import { Player } from "../player.layout.ts";

export type WaitingGameStageGA = null;

export const waitingGameStageGADef: GADefinition<WaitingGameStageGA> = {
  name: "waiting-game-stage",
};

export interface WaitingPlayersGA {
  players: Player[];
}

export const waitingPlayersGADef: GADefinition<WaitingPlayersGA> = {
  name: "waiting-players",
};
