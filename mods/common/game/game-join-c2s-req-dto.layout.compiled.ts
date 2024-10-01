import {
  exceedsMaxStringLengthErrorContract,
  exceedsMinStringLengthErrorContract,
  expectedNotNullObjectErrorContract,
  LayoutResult,
  missingObjectPropertyErrorContract,
  notMatchedErrorContract,
} from "@acme/layout/runtime/mod.ts";
import { ColorKey, parseColor } from "../color/color.layout.compiled.ts";

export interface GameJoinC2SReqDTO {
  /** One of the five colors */
  color: ColorKey;
  /** Game identifier */
  gameId: string;
  /** The player name */
  name: string;
}

export const schemaGameJoinC2SReqDTO = {
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
    "gameId": {
      "type": "string",
      "description": "Game identifier",
    },
    "name": {
      "type": "string",
      "description": "The player name",
      "minLength": 1,
      "maxLength": 32,
    },
  },
  "required": [
    "color",
    "gameId",
    "name",
  ],
  "additionalProperties": false,
};
export const parseGameJoinC2SReqDTO = (data: unknown, path: string = ""): LayoutResult<GameJoinC2SReqDTO> => {
  let output;
  while (true) {
    if (typeof data === "object") {
      if (data === null) {
        return [false, expectedNotNullObjectErrorContract, path, ""];
      }

      // Parsing property "color"
      const input_color = "color" in data === true ? data.color : undefined;
      if (input_color === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "color"];
      }
      let output_color;
      while (true) {
        const result_color = parseColor(input_color);
        if (result_color[0] === true) {
          output_color = result_color[1];
          break;
        }
        return [false, notMatchedErrorContract, path, "color"];
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

      // Parsing property "name"
      const input_name = "name" in data === true ? data.name : undefined;
      if (input_name === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "name"];
      }
      let output_name;
      while (true) {
        if (typeof input_name === "string") {
          if (input_name.length < 1) {
            return [false, exceedsMinStringLengthErrorContract, path, "name", { min: 1 }];
          }
          if (input_name.length > 32) {
            return [false, exceedsMaxStringLengthErrorContract, path, "name", { max: 32 }];
          }
          output_name = input_name;
          break;
        }
        return [false, notMatchedErrorContract, path, "name"];
      }
      output = {
        color: output_color,
        gameId: output_gameId,
        name: output_name,
      };
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
