import { defineScope } from "@acme/dependency/scopes.ts";

export const frontendScopeContract = defineScope("FRONTEND");
export const controllerScopeContract = defineScope("CTRL");
export const clientGameScopeContract = defineScope("CLIENT-GAME");
