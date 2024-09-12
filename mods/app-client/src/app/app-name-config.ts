import { defineConfig, createConfigValueDependency } from "@acme/config/common.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";

export const appNameLayout = new StringLayout({});
export const appNameConfigContract = defineConfig("app-name", appNameLayout);
export const appNameDependency = createConfigValueDependency(appNameConfigContract);
