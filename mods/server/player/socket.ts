import { ServiceResolver } from "../../common/dependency.ts";
import { provideLogger } from "../logger/global.ts";
import { WebSocketChannel } from "../web-socket/web-socket-channel.ts";

export function provideServerPlayerWebSocket(): WebSocket {
  throw new Error('server-player-web-socket-must-be-injected');
}

export function provideServerPlayerWebSocketChannel(resolver: ServiceResolver) {
  return new WebSocketChannel(
    resolver.resolve(provideLogger),
    resolver.resolve(provideServerPlayerWebSocket),
  );
}
