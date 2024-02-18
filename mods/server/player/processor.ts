import { ServiceResolver } from "../../common/dependency.ts";
import { GAProcessor } from "../../communication/processor.ts";

export function feedServerGAProcessor(resolver: ServiceResolver, gaProcessor: GAProcessor) {
  const handlers = gaProcessor.handlers;
}
