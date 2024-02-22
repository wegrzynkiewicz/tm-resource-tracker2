import { GADefinition } from "../../../common/communication/define.ts";
import { Player } from "../common.ts";

export interface WaitingPlayersGA {
  players: Player[];
}

export const waitingPlayersGADef: GADefinition<WaitingPlayersGA> = {
  kind: 'waiting-players',
};
