import { createConfigValueDependency, defineConfig } from "@acme/config/common.ts";
import { parseNotEmptyString } from "@acme/layout/runtime/parsers.ts";

export const appNameConfigContract = defineConfig("app-name", parseNotEmptyString);
export const appNameDependency = createConfigValueDependency(appNameConfigContract);
