import { assertObject, assertRequiredString } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { EPRoute, EPHandler, EPContext } from "../web/endpoint.ts";
import { ServerPlayerContextResolver, provideServerPlayerContextResolver } from "../player/resolver.ts";
import { provideServerPlayerWebSocket, provideServerPlayerWebSocketChannel } from "../player/socket.ts";

export interface PlayerWebSocketEPParams {
  token: string;
}

export function parsePlayerWebSocketEPRequest(value: unknown): PlayerWebSocketEPParams {
  assertObject<PlayerWebSocketEPParams>(value, "player-web-socket-params-must-be-object");
  const { token } = value;
  assertRequiredString(token, "player-web-socket-params-token-must-be-string");
  return { token };
}

export const playerWebSocketEPRoute = new EPRoute("GET", "/player-web-socket/:token");

export class PlayerWebSocketEPHandler implements EPHandler {
  public constructor(
    private readonly resolver: ServerPlayerContextResolver,
  ) { }

  public async handle({ params, request }: EPContext): Promise<Response> {
    const { token } = parsePlayerWebSocketEPRequest(params);
    const { playerContext } = this.resolver.resolvePlayer(token);
    const { response, socket } = Deno.upgradeWebSocket(request);
    playerContext.resolver.inject(provideServerPlayerWebSocket, socket);

    const webSocketChannel = playerContext.resolver.resolve(provideServerPlayerWebSocketChannel);
    {
      webSocketChannel.opens.on(() => {
        socket.send("hello world!")
      });
    }
    return response;
  }
}

export function providePlayerWebSocketEPHandler(resolver: ServiceResolver) {
  return new PlayerWebSocketEPHandler(
    resolver.resolve(provideServerPlayerContextResolver),
  );
}
