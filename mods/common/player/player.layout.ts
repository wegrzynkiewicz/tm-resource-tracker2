import { IntegerLayout } from "@acme/layout/types/integer-layout.ts";
import { NumberGreaterThanValidator } from "@acme/layout/types/number-greater.ts";
import { BooleanLayout } from "@acme/layout/types/boolean-layout.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { StringMaxLengthValidator } from "@acme/layout/types/string-max-length.ts";
import { StringMinLengthValidator } from "@acme/layout/types/string-min-length.ts";
import { colorLayout } from "../color/color.layout.ts";
import { ColorKey } from "../color/color.layout.compiled.ts";
import { StandaloneLayout } from "@acme/layout/types/standalone-layout.ts";
import { compileLayouts } from "@acme/layout/defs.ts";

export const playerIdLayout = new IntegerLayout({
  description: "The player ID",
  validators: [
    new NumberGreaterThanValidator(0),
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

export const playerLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parsePlayer",
  layout: new ObjectLayout({
    type: "Player",
    description: "A player in the game",
    properties: {
      color: colorLayout,
      name: playerNameLayout,
      isAdmin: isAdminLayout,
      playerId: playerIdLayout,
    },
  }),
});

export interface PlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
}

export const myPlayerUpdateLayout = new StandaloneLayout({
  meta: import.meta,
  parserName: "parseMyPlayerUpdate",
  layout: new ObjectLayout({
    type: "MyPlayerUpdate",
    description: "My player update object",
    properties: {
      color: colorLayout,
      name: playerNameLayout,
    },
  }),
});

await compileLayouts(`@acme/layout/runtime/mod.ts`, [playerLayout, myPlayerUpdateLayout]);
