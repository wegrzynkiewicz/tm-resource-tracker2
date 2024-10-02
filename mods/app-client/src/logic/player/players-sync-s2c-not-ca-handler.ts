import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { playersStoreDependency } from "./players-store.ts";
import { PlayersSyncS2CNotDTO } from "@common/player/players-sync-s2c-not-dto.layout.compiled.ts";

export function providePlayersSyncS2CNotNormalCAHandler(resolver: DependencyResolver): NormalCAHandler {
  const playersStore = resolver.resolve(playersStoreDependency);
  const handle = async (envelope: NormalCAEnvelopeDTO) => {
    const { players } = envelope.data as PlayersSyncS2CNotDTO;
    playersStore.setPlayers(players);
  };
  return { handle };
}

export const playersSyncS2CNotNormalCAHandlerDependency = defineDependency({
  name: "players-sync-s2c-not-normal-ca-handler",
  provider: providePlayersSyncS2CNotNormalCAHandler,
  scope: caScopeContract,
});
