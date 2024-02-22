import { playerDataUpdateGADef, providePlayerDataUpdateGAHandler } from "../../../actions/player-data-update.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { GAProcessor } from "../../../common/communication/processor.ts";

export function feedServerGAProcessor(resolver: ServiceResolver, processor: GAProcessor) {
  const handlers = processor.handlers;
  handlers.set(playerDataUpdateGADef.kind, resolver.resolve(providePlayerDataUpdateGAHandler));
}
