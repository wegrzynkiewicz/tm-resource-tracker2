import { GADefinition } from "../../../core/communication/define.ts";
import { Player } from "../common.ts";

export type WaitingGameStageGA = null

export const waitingGameStageGADef: GADefinition<WaitingGameStageGA> = {
  kind: 'waiting-game-stage',
};

export interface WaitingPlayersGA {
  players: Player[];
}

export const waitingPlayersGADef: GADefinition<WaitingPlayersGA> = {
  kind: 'waiting-players',
};
