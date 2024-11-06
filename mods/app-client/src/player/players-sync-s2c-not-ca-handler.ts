import { NormalCAHandler } from "@framework/control-action/normal/defs.ts";
import { NormalCAEnvelopeDTO } from "@framework/control-action/normal/envelope.layout.compiled.ts";
import { defineDependency } from "@framework/dependency/declaration.ts";
import { Context } from "@framework/dependency/context.ts";
import { caScopeToken } from "@framework/dependency/scopes.ts";
import { playersStoreDependency } from "./players-store.ts";
import { PlayersSyncS2CNotDTO } from "@common/player/players-sync-s2c-not-dto.layout.compiled.ts";

export function providePlayersSyncS2CNotNormalCAHandler(context: Context): NormalCAHandler {
  const playersStore = context.resolve(playersStoreDependency);
  const handle = async (envelope: NormalCAEnvelopeDTO) => {
    const { players } = envelope.data as PlayersSyncS2CNotDTO;
    playersStore.set(players);
  };
  return { handle };
}

export const playersSyncS2CNotNormalCAHandlerDependency = defineDependency({
  provider: providePlayersSyncS2CNotNormalCAHandler,
  scopeToken: caScopeToken,
});
