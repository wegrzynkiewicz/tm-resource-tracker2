import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { playersSyncS2CNotNormalCAContract } from "@common/player/defs.ts";
import { playerBroadcastDependency } from "../../player/player-broadcast.ts";
import { serverPlayerContextManagerDependency } from "../../player/player-context.ts";
import { GameStage } from "./defs.ts";
import { playerConnectedChannelDependency } from "../../player/defs.ts";
import { playerDisconnectedChannelDependency } from "../../player/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../../defs.ts";

export function provideWaitingGameStage(resolver: DependencyResolver): GameStage {
  const playerConnected = resolver.resolve(playerConnectedChannelDependency);
  const playerDisconnected = resolver.resolve(playerDisconnectedChannelDependency);
  const playerBroadcast = resolver.resolve(playerBroadcastDependency);
  const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);

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
  scope: serverGameScopeContract,
});
