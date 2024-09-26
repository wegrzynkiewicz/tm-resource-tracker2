import { defineScope } from "@acme/dependency/scopes.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";

export const wsScopeContract = defineScope("WEB-SOCKET");
export const wsDependency = defineDependency<WebSocket>({
  name: "web-socket",
  scope: wsScopeContract,
});
