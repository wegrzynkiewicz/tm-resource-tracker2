import { loggerDependency } from "@acme/logger/defs.ts";
import { WebSocketChannel } from "./web-socket-channel.ts";
import { defineDependency, DependencyResolver } from "@acme/dependency/injection.ts";

export function provideWebSocket(): WebSocket {
  throw new Error("web-socket-must-be-injected");
}
export const webSocketDependency = defineDependency({
  kind: "web-socket",
  provider: provideWebSocket,
});

export function provideWebSocketChannel(resolver: DependencyResolver) {
  return new WebSocketChannel(
    resolver.resolve(loggerDependency),
    resolver.resolve(webSocketDependency),
  );
}
export const webSocketChannelDependency = defineDependency({
  kind: "web-socket-channel",
  provider: provideWebSocketChannel,
});
