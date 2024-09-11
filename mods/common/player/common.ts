import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { ColorKey, colorLayout } from "../color/color.ts";
import { StringMinLengthTrait } from "@acme/layout/types/string-min-length.ts";
import { StringMaxLengthTrait } from "@acme/layout/types/string-max-length.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { InferLayout } from "@acme/layout/common.ts";
import { BooleanLayout } from "@acme/layout/types/boolean-layout.ts";
import { NumberLayout } from "@acme/layout/types/number-layout.ts";
import { NumberIntegerTrait } from "@acme/layout/types/number-integer.ts";
import { NumberGreaterThanTrait } from "@acme/layout/types/number-greater-than.ts";

export const playerIdLayout = new NumberLayout(
  {},
  [
    new NumberGreaterThanTrait(0),
    new NumberIntegerTrait(),
  ],
);

export const playerNameLayout = new StringLayout(
  {},
  [
    new StringMinLengthTrait(1),
    new StringMaxLengthTrait(32),
  ],
);

export const isAdminLayout = new BooleanLayout(
  { summary: "Determines if the player is an admin" }
);

export const playerLayout = new ObjectLayout(
  { id: "player" },
  {
    color: colorLayout,
    name: playerNameLayout,
    isAdmin: isAdminLayout,
    playerId: playerIdLayout,
  },
  [],
);

export type Player = InferLayout<typeof playerLayout>;

export interface PlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
}

export const myPlayerUpdateLayout = new ObjectLayout(
  { summary: "My player update object" },
  {
    color: colorLayout,
    name: new StringLayout(
      { summary: "Player name" },
      [
        new StringMinLengthTrait(1),
        new StringMaxLengthTrait(32),
      ],
    ),
  },
  [],
);

export type MyPlayerDTO = InferLayout<typeof myPlayerUpdateLayout>;
