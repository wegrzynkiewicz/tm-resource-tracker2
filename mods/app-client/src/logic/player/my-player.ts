import { defineDependency } from "@acme/dependency/declaration.ts";
import { PlayerDTO } from "@common/player/player-dto.layout.compiled.ts";
import { clientGameScopeContract } from "../../../defs.ts";

export const myPlayerDependency = defineDependency<PlayerDTO>({
  scope: clientGameScopeContract,
});
