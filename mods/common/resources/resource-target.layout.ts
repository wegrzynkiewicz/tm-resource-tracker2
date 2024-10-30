import { compileLayouts } from "@acme/layout/defs.ts";
import { EnumLayout } from "@acme/layout/types/enum-layout.ts";
import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";

export const resourceTargetLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseResourceTarget",
  layout: new EnumLayout({
    name: "resourceTarget",
    type: "ResourceTarget",
    description: "The target of a resource",
    values: ["amount", "production"],
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [resourceTargetLayout]);
}
