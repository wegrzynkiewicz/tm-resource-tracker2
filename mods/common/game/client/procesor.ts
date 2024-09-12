import { GAProcessor } from "../../../core/communication/processor.ts";
import { DependencyResolver } from "@acme/dependency/declaration.ts";

export function feedClientGAProcessor(resolver: DependencyResolver, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
  // handlers.set(waitingGameStageGADef.kind, resolver.resolve(waitingGameStageGAHandler)Dependency);
  // handlers.set(waitingPlayersGADef.kind, resolver.resolve(waitingPlayersGAHandler)Dependency);
  // handlers.set(serverUpdatedMyPlayerGADef.kind, resolver.resolve(serverUpdatedMyPlayerGAHandler)Dependency);
  // handlers.set(playingGameGADef.kind, resolver.resolve(serverPlayingGameGAHandler)Dependency);
}
