import { GADefinition } from "../../../core/communication/define.ts";
import { MyPlayerDTO } from "../common.ts";

export type ClientUpdatingMyPlayerGA = MyPlayerDTO;

export const clientUpdatingMyPlayerGADef: GADefinition<ClientUpdatingMyPlayerGA> = {
  kind: "client-updating-my-player",
};
