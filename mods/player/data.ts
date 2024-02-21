import { Breaker } from "../common/asserts.ts";
import { Color } from "../common/colors.ts";
import { Token } from "../server/game/token.ts";

export interface Player {
  color: Color;
  readonly isAdmin: boolean;
  name: string;
  readonly playerId: number;
  readonly token: Token;
}

export function providePlayerData(): Player {
  throw new Breaker('player-must-be-injected');
}

export interface PlayerInput {
  readonly colorKey: string;
  readonly name: string;
  readonly isAdmin: boolean;
}

export interface PlayerDTO extends PlayerInput {
  readonly playerId: number;
}

export interface PlayerDataUpdateDTO {
  colorKey: string;
  name: string;
}
