import { Context } from "@framework/dependency/context.ts";
import { playersSyncS2CNotNormalCAContract } from "@common/player/defs.ts";
import { playerBroadcastDependency } from "../../player/player-broadcast.ts";
import { serverPlayerContextManagerDependency } from "../../player/player-context.ts";
import { GameStage } from "./defs.ts";
import { playerConnectedChannelDependency } from "../../player/defs.ts";
import { playerDisconnectedChannelDependency } from "../../player/defs.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { serverGameScopeToken } from "../../defs.ts";

export function provideWaitingGameStage(context: Context): GameStage {
  const playerConnected = context.resolve(playerConnectedChannelDependency);
  const playerDisconnected = context.resolve(playerDisconnectedChannelDependency);
  const playerBroadcast = context.resolve(playerBroadcastDependency);
  const serverPlayerContextManager = context.resolve(serverPlayerContextManagerDependency);

  const name = "WAITING" as const;

  const broadcast = () => {
    const players = serverPlayerContextManager.getPlayersDTO();
    playerBroadcast.dispatch(playersSyncS2CNotNormalCAContract, { players });
  };

  const acquire = () => {
    playerConnected.on(broadcast);
    playerDisconnected.on(broadcast);
  };

  const dispose = () => {
    playerConnected.off(broadcast);
    playerDisconnected.off(broadcast);
  };

  return { name, acquire, dispose };
}

export const waitingGameStageDependency = defineDependency({
  provider: provideWaitingGameStage,
  scopeToken: serverGameScopeToken,
});
