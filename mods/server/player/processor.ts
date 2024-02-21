import { playerDataUpdateGADef, providePlayerDataUpdateGAHandler } from "../../action/player-data-update.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { GAProcessor } from "../../communication/processor.ts";

export function feedServerGAProcessor(resolver: ServiceResolver, processor: GAProcessor) {
  const handlers = processor.handlers;
  handlers.set(playerDataUpdateGADef.kind, resolver.resolve(providePlayerDataUpdateGAHandler));
}
