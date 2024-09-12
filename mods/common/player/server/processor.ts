import { GAProcessor } from "../../../core/communication/processor.ts";
import { DependencyResolver } from "@acme/dependency/declaration.ts";

export function feedServerGAProcessor(resolver: DependencyResolver, processor: GAProcessor) {
  const handlers = processor.handlers;
  // handlers.set(startGameGADef.kind, resolver.resolve(startGameGAHandler)Dependency);
  // handlers.set(clientUpdatingMyPlayerGADef.kind, resolver.resolve(clientUpdatingMyPlayerGAHandler)Dependency);
}
