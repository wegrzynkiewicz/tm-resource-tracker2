import { Context } from "@acme/dependency/service-resolver.ts";
import { GADefinition, GAEnvelope } from "./define.ts";
import { provideWebSocketChannel } from "./socket.ts";
import { WebSocketChannel } from "./web-socket-channel.ts";
import { DEBUG, Logger, provideLogger } from "@acme/logger/defs.ts";

export class GADispatcher {
  public constructor(
    public readonly logger: Logger,
    public readonly webSocketChannel: WebSocketChannel,
  ) {}

  public send<TData>(definition: GADefinition<TData>, body: TData): void {
    const { kind } = definition;
    body = body ?? {} as TData;
    const envelope: GAEnvelope<TData> = { kind, body };
    this.logger.log(DEBUG, `dispatcher-send`, { envelope });
    const data = JSON.stringify(envelope);
    this.webSocketChannel.send(data);
  }
}

export function provideGADispatcher(context: Context) {
  return new GADispatcher(
    context.resolve(loggerDependency),
    context.resolve(webSocketChannelDependency),
  );
}
