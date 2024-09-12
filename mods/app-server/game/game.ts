import { defineDependency } from "@acme/dependency/injection.ts";
import { Scope } from "@acme/dependency/scopes.ts";

export interface Game {
  gameId: string;
  scope: Scope;
}

export const gameDependency = defineDependency({ kind: "game" });
