import { Player } from "../../../common/player/common.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export const myPlayerDependency = defineDependency<Player>({ name: "my-player" });
