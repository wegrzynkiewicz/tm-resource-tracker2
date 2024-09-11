import { DependencyResolver } from "@acme/dependency/service-resolver.ts";
import { assertRequiredString, Breaker } from "../asserts.ts";
import { Channel, Handler } from "../channel.ts";
import { AnyGAEnvelope, provideReceivingGABus } from "./define.ts";

export class GADecoder implements Handler<MessageEvent> {
  public constructor(
    public readonly gaBus: Channel<AnyGAEnvelope>,
  ) {}

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

export function provideGADecoder(resolver: DependencyResolver) {
  return new GADecoder(
    resolver.resolve(receivingGABusDependency),
  );
}
