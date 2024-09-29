import { defineNormalCA } from "@acme/control-action/normal/defs.ts";
import { PlayersSyncS2CNotDTO } from "./players-sync-s2c-not-dto.layout.compiled.ts";

export const playersSyncNotS2CNormalCA = defineNormalCA<PlayersSyncS2CNotDTO>("s2c-not-players-sync");
