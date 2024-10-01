import { defineDependency } from "@acme/dependency/declaration.ts";
import { clientGameScopeContract } from "../../defs.ts";
import { PlayerDTO } from "../../../common/player/player-dto.layout.compiled.ts";

export const myPlayerDependency = defineDependency<PlayerDTO>({
  name: "my-player",
  scope: clientGameScopeContract,
});
