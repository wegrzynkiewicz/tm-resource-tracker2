import { defineConfig, createConfigValueDependency } from "@acme/config/common.ts";
import { InferLayout } from "@acme/layout/common.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { StringMaxLengthTrait } from "@acme/layout/types/string-max-length.ts";
import { StringMinLengthTrait } from "@acme/layout/types/string-min-length.ts";

export const apiURLLayout = new StringLayout(
  { summary: "The URL of the API server" },
  [
    new StringMinLengthTrait(1),
    new StringMaxLengthTrait(256),
  ],
);

export type ApiURL = InferLayout<typeof apiURLLayout>;

export const apiURLConfigContract = defineConfig("api-url", apiURLLayout);
export const apiURLDependency = createConfigValueDependency(apiURLConfigContract);
