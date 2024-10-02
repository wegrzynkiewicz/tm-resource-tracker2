import { defineDependency } from "@acme/dependency/declaration.ts";
import { NormalCAContract, NormalCADispatcher } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeContract } from "../defs.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { Logger, loggerDependency, TRACE } from "@acme/logger/defs.ts";
import { playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { webSocketDependency } from "@acme/control-action/transport/defs.ts";

export class PlayerBroadcast implements NormalCADispatcher {
  public socketByPlayerId = new Map<string, WebSocket>();

  public constructor(
    private readonly logger: Logger,
  ) {}

  public dispatch<T>(contract: NormalCAContract<T>, data: T): void {
    const envelope: NormalCAEnvelopeDTO = { name: contract.name, data };
    const message = JSON.stringify(envelope);
    this.logger.log(TRACE, "player-broadcast", { envelope });
    for (const socket of this.socketByPlayerId.values()) {
      socket.send(message);
    }
  }
}

export function providePlayerBroadcast(resolver: DependencyResolver) {
  const logger = resolver.resolve(loggerDependency);
  const playerConnected = resolver.resolve(playerConnectedChannelDependency);
  const playerDisconnected = resolver.resolve(playerDisconnectedChannelDependency);

  const playerBroadcast = new PlayerBroadcast(logger);

  playerConnected.on((ctx, player) => {
    const webSocket = ctx.resolver.resolve(webSocketDependency);
    playerBroadcast.socketByPlayerId.set(player.playerId, webSocket);
  });

  playerDisconnected.on((_ctx, player) => {
    playerBroadcast.socketByPlayerId.delete(player.playerId);
  });

  return playerBroadcast;
}

export const playerBroadcastDependency = defineDependency({
  name: "player-broadcast",
  provider: providePlayerBroadcast,
  scope: serverGameScopeContract,
});
