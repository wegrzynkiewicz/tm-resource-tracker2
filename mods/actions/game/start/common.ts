import { GADefinition } from "../../../common/communication/define.ts";

export type StartGameGA = null;

export const startGameGADef: GADefinition<StartGameGA> = {
  kind: 'start-game',
};
