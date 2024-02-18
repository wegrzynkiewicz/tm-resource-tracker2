import { ServiceResolver } from "../common/dependency.ts";
import { provideLogger } from "../logger/global.ts";
import { WebSocketChannel } from "./web-socket-channel.ts";

export function provideWebSocket(): WebSocket {
  throw new Error('web-socket-must-be-injected');
}

export function provideWebSocketChannel(resolver: ServiceResolver) {
  return new WebSocketChannel(
    resolver.resolve(provideLogger),
    resolver.resolve(provideWebSocket),
  );
}
