import { ServiceResolver } from "../common/dependency.ts";
import { Logger, provideLogger } from "../logger/global.ts";
import { GADefinition, GAEnvelope } from "./define.ts";
import { provideWebSocketChannel } from "./socket.ts";
import { WebSocketChannel } from "./web-socket-channel.ts";

export class GADispatcher {
  public constructor(
    public readonly logger: Logger,
    public readonly webSocketChannel: WebSocketChannel,
  ) { }

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    const { kind } = definition;
    body = body ?? {} as TData;
    const envelope: GAEnvelope<TData> = { kind, body };
    this.logger.debug(`dispatcher-send`, { envelope });
    const data = JSON.stringify(envelope)
    this.webSocketChannel.send(data);
  }
}

export function provideGADispatcher(resolver: ServiceResolver) {
  return new GADispatcher(
    resolver.resolve(provideLogger),
    resolver.resolve(provideWebSocketChannel),
  );
}
