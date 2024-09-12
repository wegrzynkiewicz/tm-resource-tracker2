import { Player } from "../../../common/player/common.ts";
import { defineDependency } from "@acme/dependency/injection.ts";

export const myPlayerDependency = defineDependency<Player>({ kind: "my-player" });
