import { Player } from "../../../common/player/common.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { clientGameScopeContract } from "../../bootstrap.ts";

export const myPlayerDependency = defineDependency<Player>({ 
  name: "my-player",
  scope: clientGameScopeContract,
});
