import { defineDependency } from "@acme/dependency/declaration.ts";
import { frontendScopeContract } from "../../../defs.ts";
import { Slot } from "../../place.ts";

export function provideAppSlot() {
  return new Slot("app");
}

export const appSlotDependency = defineDependency({
  provider: provideAppSlot,
  scope: frontendScopeContract,
});
