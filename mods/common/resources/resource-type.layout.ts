import { compileLayouts } from "@framework/layout/defs.ts";
import { EnumLayout } from "@framework/layout/types/enum-layout.ts";
import { StandaloneLayout } from "@framework/layout/types/standalone-layout.ts";

export const resourceTypeLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseResourceType",
  layout: new EnumLayout({
    name: "resourceType",
    type: "ResourceType",
    description: "The type of a resource",
    values: ["points", "gold", "steel", "titan", "plant", "energy", "heat"],
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [resourceTypeLayout]);
}
