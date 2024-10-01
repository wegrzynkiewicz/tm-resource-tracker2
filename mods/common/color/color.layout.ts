import { EnumLayout } from "@acme/layout/types/enum-layout.ts";
import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { colors } from "./color.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const colorLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseColor",
  layout: new EnumLayout({
    description: "One of the five colors",
    id: "color",
    values: colors.map((color) => color.key),
    name: "colorKey",
    type: "ColorKey",
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [colorLayout]);
}
