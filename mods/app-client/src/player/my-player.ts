import { defineDependency } from "@acme/dependency/declaration.ts";
import { clientGameScopeContract } from "../../bootstrap.ts";
import { PlayerDTO } from "../../../common/player/player.layout.compiled.ts";

export const myPlayerDependency = defineDependency<PlayerDTO>({
  name: "my-player",
  scope: clientGameScopeContract,
});
