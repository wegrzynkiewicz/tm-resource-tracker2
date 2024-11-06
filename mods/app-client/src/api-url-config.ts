import { createConfigValueDependency, defineConfig } from "@framework/config/common.ts";
import { parseURL } from "@framework/layout/runtime/parsers.ts";

export const apiURLConfigContract = defineConfig("api-url", parseURL);
export const apiURLDependency = createConfigValueDependency(apiURLConfigContract);
