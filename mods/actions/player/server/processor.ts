import { playerDataUpdateGADef, providePlayerDataUpdateGAHandler } from "./player-data-update.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GAProcessor } from "../../../common/communication/processor.ts";
import { startGameGADef } from "../../game/start/common.ts";
import { provideStartGameGAHandler } from "../../game/start/action-handler.ts";

export function feedServerGAProcessor(resolver: ServiceResolver, processor: GAProcessor) {
  const handlers = processor.handlers;
  handlers.set(playerDataUpdateGADef.kind, resolver.resolve(providePlayerDataUpdateGAHandler));
  handlers.set(startGameGADef.kind, resolver.resolve(provideStartGameGAHandler));
}
