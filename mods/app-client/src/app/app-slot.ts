import { defineDependency } from "@framework/dependency/declaration.ts";
import { frontendScopeToken } from "../defs.ts";
import { Slot } from "@framework/dom/slot.ts";

export function provideAppSlot() {
  return new Slot("app");
}

export const appSlotDependency = defineDependency({
  provider: provideAppSlot,
  scopeToken: frontendScopeToken,
});
