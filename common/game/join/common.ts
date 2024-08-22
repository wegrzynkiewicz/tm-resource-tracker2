import { assertObject, assertRequiredString } from "../../../core/asserts.ts";
import { ColorKey, assertColor } from "../../color/color.ts";

export interface JoinGame {
  color: ColorKey;
  gameId: string;
  name: string;
}

export function parseJoinGame(data: unknown): JoinGame {
  assertObject<JoinGame>(data, 'payload-must-be-object');
  const { color, gameId, name } = data;
  assertColor(color, 'color-must-be-required-string');
  assertRequiredString(gameId, 'gameId-must-be-required-string');
  assertRequiredString(name, 'name-must-be-required-string');
  return { color, gameId, name };
}
