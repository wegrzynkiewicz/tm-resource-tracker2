import { LayoutResult, exceedsMaxStringLengthErrorContract, exceedsMinStringLengthErrorContract, expectedNotNullObjectErrorContract, missingObjectPropertyErrorContract, notMatchedErrorContract } from "@acme/layout/runtime/mod.ts";
import { ColorKey, parseColor } from "../color/color.layout.compiled.ts";

/** A player in the game */
export interface PlayerDTO {
  /** One of the five colors */
  color: ColorKey;
  /** The player name */
  name: string;
  /** Determines if the player is an admin */
  isAdmin: boolean;
  /** The player ID */
  playerId: string;
}

export const schemaPlayerDTO = {
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
        "yellow"
      ]
    },
    "name": {
      "type": "string",
      "description": "The player name",
      "minLength": 1,
      "maxLength": 32
    },
    "isAdmin": {
      "description": "Determines if the player is an admin",
      "type": "boolean"
    },
    "playerId": {
      "type": "string",
      "description": "The player ID",
      "minLength": 1
    }
  },
  "required": [
    "color",
    "name",
    "isAdmin",
    "playerId"
  ],
  "additionalProperties": false
};
export const parsePlayerDTO = (data: unknown, path: string = ""): LayoutResult<PlayerDTO> => {
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

      // Parsing property "isAdmin"
      const input_isAdmin = "isAdmin" in data === true ? data.isAdmin : undefined;
      if (input_isAdmin === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "isAdmin"];
      }
      let output_isAdmin;
      while (true) {
        if (typeof input_isAdmin === "boolean") {
          output_isAdmin = input_isAdmin;
          break;
        }
        return [false, notMatchedErrorContract, path, "isAdmin"];
      }

      // Parsing property "playerId"
      const input_playerId = "playerId" in data === true ? data.playerId : undefined;
      if (input_playerId === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "playerId"];
      }
      let output_playerId;
      while (true) {
        if (typeof input_playerId === "string") {
          if (input_playerId.length < 1) {
            return [false, exceedsMinStringLengthErrorContract, path, "playerId", { min: 1 }];
          }
          output_playerId = input_playerId;
          break;
        }
        return [false, notMatchedErrorContract, path, "playerId"];
      }
      output = {
        color: output_color,
        name: output_name,
        isAdmin: output_isAdmin,
        playerId: output_playerId,
      };
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
