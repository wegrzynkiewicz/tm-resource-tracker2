import { IntegerLayout } from "@acme/layout/types/integer-layout.ts";
import { resourceTargetLayout } from "./resource-target.layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { resourceTypeLayout } from "./resource-type.layout.ts";
import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const resourceUpdateC2SReqDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseResourceUpdateC2SReqDTO",
  layout: new ObjectLayout({
    type: "ResourceUpdateC2SReqDTO",
    properties: {
      type: resourceTypeLayout,
      target: resourceTargetLayout,
      count: new IntegerLayout({
        description: "The amount of resources to update",
      }),
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [resourceUpdateC2SReqDTOLayout]);
}
