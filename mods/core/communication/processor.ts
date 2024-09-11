import { Breaker } from "../asserts.ts";
import { Handler } from "../channel.ts";
import { AnyGAEnvelope } from "./define.ts";

export class GAProcessor implements Handler<AnyGAEnvelope> {
  public handlers = new Map<string, Handler<any>>();

  public handle(envelope: AnyGAEnvelope): void {
    const { kind, body } = envelope;
    const handler = this.handlers.get(kind);
    if (!handler) {
      return;
    }
    try {
      handler.handle(body);
    } catch (error) {
      throw new Breaker("error-inside-game-action-processor", { kind, envelope, error });
    }
  }
}

export function provideGAProcessor() {
  return new GAProcessor();
}
