import { defineDependency } from "@acme/dependency/declaration.ts";
import { Scope } from "@acme/dependency/scopes.ts";

export interface ServerGame {
  gameId: string;
  scope: Scope;
}

export const gameDependency = defineDependency({ name: "game" });
