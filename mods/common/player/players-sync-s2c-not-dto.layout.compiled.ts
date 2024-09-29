import {
  expectedNotNullObjectErrorContract,
  LayoutResult,
  missingObjectPropertyErrorContract,
  notMatchedArrayItemErrorContract,
  notMatchedErrorContract,
} from "@acme/layout/runtime/mod.ts";
import { parsePlayerDTO, PlayerDTO } from "./player.layout.compiled.ts";

export interface PlayersSyncS2CNotDTO {
  players: PlayerDTO[];
}

export const schemaPlayersSyncS2CNotDTO = {
  "type": "object",
  "properties": {
    "players": {
      "type": "array",
      "items": {
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
    },
  },
  "required": [
    "players",
  ],
  "additionalProperties": false,
};
export const parsePlayersSyncS2CNotDTO = (data: unknown, path: string = ""): LayoutResult<PlayersSyncS2CNotDTO> => {
  let output;
  while (true) {
    if (typeof data === "object") {
      if (data === null) {
        return [false, expectedNotNullObjectErrorContract, path, ""];
      }

      // Parsing property "players"
      const input_players = "players" in data === true ? data.players : undefined;
      if (input_players === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "players"];
      }
      let output_players;
      while (true) {
        if (Array.isArray(input_players)) {
          const len = input_players.length;
          output_players = new Array(len);
          for (let i = 0; i < len; i++) {
            const input_item = input_players[i];
            let output_item;
            while (true) {
              const result_item = parsePlayerDTO(input_item);
              if (result_item[0] === true) {
                output_item = result_item[1];
                break;
              }
              return [false, notMatchedArrayItemErrorContract, path, `"players[${i}]"`];
            }
            output_players[i] = output_item;
          }
          break;
        }
        return [false, notMatchedErrorContract, path, "players"];
      }
      output = {
        players: output_players,
      };
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
