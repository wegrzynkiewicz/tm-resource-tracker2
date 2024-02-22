import { Breaker, assertObject, assertRequiredString } from "../common/asserts.ts";
import { ColorKey, assertColor } from "./colors.ts";

export function providePlayer(): Player {
  throw new Breaker('player-must-be-injected');
}

export interface PlayerInput {
  color: ColorKey;
  name: string;
  isAdmin: boolean;
}

export interface Player extends PlayerInput {
  playerId: number;
}

export interface PlayerUpdateDTO {
  color: ColorKey;
  name: string;
}

export function parsePlayerUpdateDTO(data: unknown): PlayerUpdateDTO {
  assertObject<PlayerUpdateDTO>(data, 'payload-must-be-object');
  const { color, name } = data;
  assertColor(color, 'color-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { color, name };
}
