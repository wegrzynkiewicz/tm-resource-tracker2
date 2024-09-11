import { defineScope, globalScopeContract } from "@acme/dependency/scopes.ts";

export const frontendScopeContract = defineScope("FE", globalScopeContract);
export const controllerScopeContract = defineScope("CTRL", globalScopeContract);
