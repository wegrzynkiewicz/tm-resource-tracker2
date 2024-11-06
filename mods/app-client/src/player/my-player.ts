import { createInjectableProvider, defineDependency } from "@framework/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { clientGameScopeToken } from "../defs.ts";

export const myPlayerDependency = defineDependency<PlayerDTO>({
  provider: createInjectableProvider("my-player"),
  scopeToken: clientGameScopeToken,
});
