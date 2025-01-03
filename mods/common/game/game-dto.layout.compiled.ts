import {
  expectedNotNullObjectErrorContract,
  LayoutResult,
  missingObjectPropertyErrorContract,
  notMatchedErrorContract,
} from "@framework/layout/runtime/mod.ts";
import { parsePlayerDTO, PlayerDTO } from "../player/player-dto.layout.compiled.ts";

/** Game */
export interface GameDTO {
  /** Game identifier */
  gameId: string;
  /** A player in the game */
  player: PlayerDTO;
  /** Token */
  token: string;
}

export const schemaGameDTO = {
  "description": "Game",
  "type": "object",
  "properties": {
    "gameId": {
      "type": "string",
      "description": "Game identifier",
    },
    "player": {
      "description": "A player in the game",
      "type": "object",
      "properties": {
        "color": {
          "$id": "color",
          "description": "One of the five colors",
          "enum": [
            "black",
            "blue",
            "green",
            "red",
            "yellow",
          ],
        },
        "name": {
          "type": "string",
          "description": "The player name",
          "minLength": 1,
          "maxLength": 32,
        },
        "isAdmin": {
          "description": "Determines if the player is an admin",
          "type": "boolean",
        },
        "playerId": {
          "type": "string",
          "description": "The player ID",
          "minLength": 1,
        },
      },
      "required": [
        "color",
        "name",
        "isAdmin",
        "playerId",
      ],
      "additionalProperties": false,
    },
    "token": {
      "type": "string",
      "description": "Token",
    },
  },
  "required": [
    "gameId",
    "player",
    "token",
  ],
  "additionalProperties": false,
};
export const parseGameDTO = (data: unknown, path: string = ""): LayoutResult<GameDTO> => {
  let output;
  while (true) {
    if (typeof data === "object") {
      if (data === null) {
        return [false, expectedNotNullObjectErrorContract, path, ""];
      }

      // Parsing property "gameId"
      const input_gameId = "gameId" in data === true ? data.gameId : undefined;
      if (input_gameId === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "gameId"];
      }
      let output_gameId;
      while (true) {
        if (typeof input_gameId === "string") {
          output_gameId = input_gameId;
          break;
        }
        return [false, notMatchedErrorContract, path, "gameId"];
      }

      // Parsing property "player"
      const input_player = "player" in data === true ? data.player : undefined;
      if (input_player === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "player"];
      }
      let output_player;
      while (true) {
        const result_player = parsePlayerDTO(input_player);
        if (result_player[0] === true) {
          output_player = result_player[1];
          break;
        }
        return [false, notMatchedErrorContract, path, "player"];
      }

      // Parsing property "token"
      const input_token = "token" in data === true ? data.token : undefined;
      if (input_token === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "token"];
      }
      let output_token;
      while (true) {
        if (typeof input_token === "string") {
          output_token = input_token;
          break;
        }
        return [false, notMatchedErrorContract, path, "token"];
      }
      output = {
        gameId: output_gameId,
        player: output_player,
        token: output_token,
      };
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
