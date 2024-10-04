import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";
import { playersStoreDependency } from "../player/players-store.ts";
import { gameStoreDependency } from "./game-store.ts";

export function provideGameSyncS2CNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const playersStore = resolver.resolve(playersStoreDependency);
  const gameStore = resolver.resolve(gameStoreDependency);
  const handle = async (envelope: NormalCAEnvelopeDTO) => {
    const { players } = envelope.data as GameSyncS2CNotDTO;
    playersStore.set(players);
    gameStore.sync();
  };
  return { handle };
}

export const gameSyncS2CNotNormalCAHandlerDependency = defineDependency({
  provider: provideGameSyncS2CNotNormalCAHandler,
  scope: caScopeContract,
});
