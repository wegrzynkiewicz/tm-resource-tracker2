import { defineNormalCA } from "@acme/control-action/normal/defs.ts";
import { PlayersSyncS2CNotDTO } from "./players-sync-s2c-not-dto.layout.compiled.ts";

export const playersSyncS2CNotNormalCA = defineNormalCA<PlayersSyncS2CNotDTO>("s2c-not-players-sync");
