import { defineDependency } from "@framework/dependency/declaration.ts";
import { InferNormalCAContract, NormalCAContract, NormalCADispatcher } from "@framework/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@framework/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeToken } from "../defs.ts";
import { Logger, TRACE } from "@framework/logger/defs.ts";
import { playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { webSocketDependency } from "@framework/control-action/transport/defs.ts";
import { Context } from "@framework/dependency/context.ts";
import { serverGameLoggerDependency } from "../game/game-logger.ts";

export class PlayerBroadcast implements NormalCADispatcher {
  public socketByPlayerId = new Map<string, WebSocket>();

  public constructor(
    private readonly logger: Logger,
  ) {}

  public dispatch<TContract extends NormalCAContract>(
    contract: TContract,
    data: InferNormalCAContract<TContract>,
  ): void {
    const envelope: NormalCAEnvelopeDTO = { name: contract.name, data };
    const message = JSON.stringify(envelope);
    this.logger.log(TRACE, "player-broadcast", { envelope });
    for (const socket of this.socketByPlayerId.values()) {
      socket.send(message);
    }
  }
}

export function providePlayerBroadcast(context: Context) {
  const logger = context.resolve(serverGameLoggerDependency);
  const playerConnected = context.resolve(playerConnectedChannelDependency);
  const playerDisconnected = context.resolve(playerDisconnectedChannelDependency);

  const playerBroadcast = new PlayerBroadcast(logger);

  playerConnected.on((ctx, player) => {
    const webSocket = ctx.resolve(webSocketDependency);
    playerBroadcast.socketByPlayerId.set(player.playerId, webSocket);
  });

  playerDisconnected.on((_ctx, player) => {
    playerBroadcast.socketByPlayerId.delete(player.playerId);
  });

  return playerBroadcast;
}

export const playerBroadcastDependency = defineDependency({
  provider: providePlayerBroadcast,
  scopeToken: serverGameScopeToken,
});
