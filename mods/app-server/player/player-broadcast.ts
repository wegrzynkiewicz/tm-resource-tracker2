import { defineDependency } from "@acme/dependency/declaration.ts";
import { InferNormalCAContract, NormalCAContract, NormalCADispatcher } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { serverGameScopeContract } from "../defs.ts";
import { Context } from "../../qcmf5/mods/dependency/context.ts";
import { Logger, loggerDependency, TRACE } from "@acme/logger/defs.ts";
import { playerConnectedChannelDependency, playerDisconnectedChannelDependency } from "./defs.ts";
import { webSocketDependency } from "@acme/control-action/transport/defs.ts";

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
  const logger = context.resolve(loggerDependency);
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
  scope: serverGameScopeContract,
});
