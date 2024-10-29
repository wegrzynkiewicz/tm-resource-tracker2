import { GAProcessor } from "../../../core/communication/processor.ts";
import { Context } from "@acme/dependency/declaration.ts";

export function feedClientGAProcessor(context: Context, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
  // handlers.set(waitingGameStageGADef.kind, context.resolve(waitingGameStageGAHandler)Dependency);
  // handlers.set(waitingPlayersGADef.kind, context.resolve(waitingPlayersGAHandler)Dependency);
  // handlers.set(serverUpdatedMyPlayerGADef.kind, context.resolve(serverUpdatedMyPlayerGAHandler)Dependency);
  // handlers.set(playingGameGADef.kind, context.resolve(serverPlayingGameGAHandler)Dependency);
}
