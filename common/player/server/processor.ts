import { provideClientUpdatingMyPlayerGAHandler } from "../update/client-update-my-player.ts";
import { ServiceResolver } from "../../../core/dependency.ts";
import { GAProcessor } from "../../../core/communication/processor.ts";
import { startGameGADef } from "../../game/start/common.ts";
import { provideStartGameGAHandler } from "../../game/start/start-action-handler.ts";
import { clientUpdatingMyPlayerGADef } from "../update/common.ts";

export function feedServerGAProcessor(resolver: ServiceResolver, processor: GAProcessor) {
  const handlers = processor.handlers;
  handlers.set(startGameGADef.kind, resolver.resolve(provideStartGameGAHandler));
  handlers.set(clientUpdatingMyPlayerGADef.kind, resolver.resolve(provideClientUpdatingMyPlayerGAHandler));
}
