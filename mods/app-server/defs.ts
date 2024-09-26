import { defineScope } from "@acme/dependency/scopes.ts";

export const serverPlayerScopeContract = defineScope("SRV-PLAYER");
export const serverPlayerWSScopeContract = defineScope("SRV-PLAYER-WS");
