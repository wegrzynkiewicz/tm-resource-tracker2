import { GAProcessor } from "../../../core/communication/processor.ts";
import { Context } from "@acme/dependency/declaration.ts";

export function feedServerGAProcessor(context: Context, processor: GAProcessor) {
  const handlers = processor.handlers;
  // handlers.set(startGameGADef.kind, context.resolve(startGameGAHandler)Dependency);
  // handlers.set(clientUpdatingMyPlayerGADef.kind, context.resolve(clientUpdatingMyPlayerGAHandler)Dependency);
}
