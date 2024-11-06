import { defineScopeToken } from "@acme/dependency/scopes.ts";

export const frontendScopeContract = defineScopeToken("FRONTEND");
export const controllerScopeContract = defineScopeToken("CONTROLLER");
export const clientGameScopeContract = defineScopeToken("CLIENT-GAME");
