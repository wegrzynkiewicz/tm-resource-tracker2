import { createPlayingPath } from './../../frontend/routes.ts';
import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";
import { playersStoreDependency } from "../player/players-store.ts";
import { controllerRunnerDependency } from "../../controller.ts";

export function provideGameSyncS2CNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const playersStore = resolver.resolve(playersStoreDependency);
  const controllerRunner = resolver.resolve(controllerRunnerDependency);
  const handle = async (envelope: NormalCAEnvelopeDTO) => {
    const { stage, players } = envelope.data as GameSyncS2CNotDTO;
    playersStore.setPlayers(players);
    if (stage === "playing") {
      controllerRunner.run(createPlayingPath('supplies'));
    }
  };
  return { handle };
}

export const gameSyncS2CNotNormalCAHandlerDependency = defineDependency({
  name: "game-sync-s2c-not-normal-ca-handler",
  provider: provideGameSyncS2CNotNormalCAHandler,
  scope: caScopeContract,
});
