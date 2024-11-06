import { defineNormalCA } from "@framework/control-action/normal/defs.ts";
import { PlayersSyncS2CNotDTO } from "./players-sync-s2c-not-dto.layout.compiled.ts";

export const playersSyncS2CNotNormalCAContract = defineNormalCA<PlayersSyncS2CNotDTO>("s2c-not-players-sync");
