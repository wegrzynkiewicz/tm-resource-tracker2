import { Breaker, assertRequiredString } from "../common/asserts.ts";
import { Channel, Handler } from "../common/channel.ts";
import { ServiceResolver } from "../common/dependency.ts";
import { AnyGAEnvelope, provideReceivingGABus } from "./define.ts";

export class GADecoder implements Handler<MessageEvent> {
  public constructor(
    public readonly gaBus: Channel<AnyGAEnvelope>,
  ) { }

  public handle(event: MessageEvent<unknown>): void {
    const { data } = event;
    assertRequiredString(data, "invalid-ga-envelope");
    const envelope = JSON.parse(data) as AnyGAEnvelope;
    const { kind } = envelope;
    assertRequiredString(kind, "invalid-ga-envelope-kind");
    try {
      this.gaBus.emit(envelope);
    } catch (error) {
      throw new Breaker("error-inside-ga-decoder", { envelope, error, kind });
    }
  }
}

export function provideGADecoder(resolver: ServiceResolver) {
  return new GADecoder(
    resolver.resolve(provideReceivingGABus),
  );
}
