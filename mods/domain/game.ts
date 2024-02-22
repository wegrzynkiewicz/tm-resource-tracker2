import { assertObject, assertRequiredString } from "../common/asserts.ts";
import { ColorKey, assertColor } from "./colors.ts";
import { Player } from "./player.ts";

export interface GameResponse {
  readonly gameId: string;
  readonly player: Player;
  readonly token: string;
}

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
