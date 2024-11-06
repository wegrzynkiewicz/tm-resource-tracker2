import { defineScopeToken } from "@acme/dependency/scopes.ts";

export const frontendScopeToken = defineScopeToken("FRONTEND");
export const controllerScopeToken = defineScopeToken("CONTROLLER");
export const clientGameScopeToken = defineScopeToken("CLIENT-GAME");
