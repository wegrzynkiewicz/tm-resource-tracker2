import { GADefinition } from "../../../common/communication/define.ts";
import { PlayerUpdateDTO } from "../common.ts";

export type ClientUpdatingMyPlayerGA = PlayerUpdateDTO;

export const clientUpdatingMyPlayerGADef: GADefinition<ClientUpdatingMyPlayerGA> = {
  kind: 'client-updating-my-player',
};
