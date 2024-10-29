import { NormalCAHandler } from "@acme/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@acme/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { Context } from "../../../../qcmf5/mods/dependency/context.ts";
import { caScopeContract } from "@acme/dependency/scopes.ts";
import { GameSyncS2CNotDTO } from "@common/game/game-sync-s2c-not-dto.layout.compiled.ts";
import { playersStoreDependency } from "../player/players-store.ts";
import { gameStoreDependency } from "./game-store.ts";

export function provideGameSyncS2CNotNormalCAHandler(context: Context): NormalCAHandler {
  const playersStore = context.resolve(playersStoreDependency);
  const gameStore = context.resolve(gameStoreDependency);
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
