import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { Slot } from "../place.ts";

export function provideAppSlot() {
  return new Slot("app");
}

export const appSlotDependency = defineDependency({
  provider: provideAppSlot,
  scopeToken: frontendScopeToken,
});
