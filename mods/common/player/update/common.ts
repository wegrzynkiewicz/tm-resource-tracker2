import { GADefinition } from "../../../core/communication/define.ts";
import { MyPlayerDTO } from "../common.ts";

export type ClientUpdatingMyPlayerGA = MyPlayerDTO;

export const clientUpdatingMyPlayerGADef: GADefinition<ClientUpdatingMyPlayerGA> = {
  name: "client-updating-my-player",
};
