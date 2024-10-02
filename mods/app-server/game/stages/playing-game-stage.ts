import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { playerBroadcastDependency } from "../../player/player-broadcast.ts";
import { serverPlayerContextManagerDependency } from "../../player/player-context.ts";
import { GameStage } from "./defs.ts";
import { playerConnectedChannelDependency } from "../../player/defs.ts";
import { playerDisconnectedChannelDependency } from "../../player/defs.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { serverGameScopeContract } from "../../defs.ts";
import { gameStageS2CNotNormalCAContract, gameSyncS2CNotNormalCAContract } from "@common/game/defs.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";

export function providePlayingGameStage(resolver: DependencyResolver): GameStage {
  const playerConnected = resolver.resolve(playerConnectedChannelDependency);
  const playerDisconnected = resolver.resolve(playerDisconnectedChannelDependency);
  const playerBroadcast = resolver.resolve(playerBroadcastDependency);
  const serverPlayerContextManager = resolver.resolve(serverPlayerContextManagerDependency);

  const name = "PLAYING" as const;

  const broadcast = () => {
    const data: GameSyncS2CNotDTO = {
      players: serverPlayerContextManager.getPlayersDTO(),
    };
    playerBroadcast.dispatch(gameSyncS2CNotNormalCAContract, data);
  };

  const acquire = () => {
    playerConnected.on(broadcast);
    playerDisconnected.on(broadcast);
    playerBroadcast.dispatch(gameStageS2CNotNormalCAContract, name);
    broadcast();
  };

  const dispose = () => {
    playerConnected.off(broadcast);
    playerDisconnected.off(broadcast);
  };

  return { name, acquire, dispose };
}

export const playingGameStageDependency = defineDependency({
  name: "playing-game-stage",
  provider: providePlayingGameStage,
  scope: serverGameScopeContract,
});
