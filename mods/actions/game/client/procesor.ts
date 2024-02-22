import { ServiceResolver } from "../../../common/dependency.ts";
import { GAProcessor } from "../../../common/communication/processor.ts";
import { gameStageGADef, provideGameStageGAHandler } from "../../game-stage-ga.ts";
import { waitingPlayersGADef, provideWaitingPlayersGAHandler } from "../../player/waiting/action-handler.ts";

export function feedClientGAProcessor(resolver: ServiceResolver, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
  handlers.set(gameStageGADef.kind, resolver.resolve(provideGameStageGAHandler));
  handlers.set(waitingPlayersGADef.kind, resolver.resolve(provideWaitingPlayersGAHandler));
}
