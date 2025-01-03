import { BooleanLayout } from "@framework/layout/types/boolean-layout.ts";
import { ObjectLayout } from "@framework/layout/types/object-layout.ts";
import { StringLayout } from "@framework/layout/types/string-layout.ts";
import { StringMaxLengthValidator } from "@framework/layout/types/string-max-length.ts";
import { StringMinLengthValidator } from "@framework/layout/types/string-min-length.ts";
import { colorLayout } from "../color/color.layout.ts";
import { StandaloneLayout } from "@framework/layout/types/standalone-layout.ts";
import { compileLayouts } from "@framework/layout/defs.ts";

export const playerIdLayout = new StringLayout({
  description: "The player ID",
  validators: [
    new StringMinLengthValidator(1),
  ],
});

export const playerNameLayout = new StringLayout({
  description: "The player name",
  validators: [
    new StringMinLengthValidator(1),
    new StringMaxLengthValidator(32),
  ],
});

export const isAdminLayout = new BooleanLayout({
  description: "Determines if the player is an admin",
});

export const playerDTOLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayerDTO",
  layout: new ObjectLayout({
    type: "PlayerDTO",
    description: "A player in the game",
    properties: {
      color: colorLayout,
      name: playerNameLayout,
      isAdmin: isAdminLayout,
      playerId: playerIdLayout,
    },
  }),
});

if (import.meta.main) {
  await compileLayouts(`@acme/layout/runtime/mod.ts`, [playerDTOLayout]);
}
