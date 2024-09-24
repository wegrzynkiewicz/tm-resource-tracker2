import { createConfigValueDependency, defineConfig } from "@acme/config/common.ts";
import { parseURL } from "@acme/layout/runtime/parsers.ts";

export const apiURLConfigContract = defineConfig("api-url", parseURL);
export const apiURLDependency = createConfigValueDependency(apiURLConfigContract);
