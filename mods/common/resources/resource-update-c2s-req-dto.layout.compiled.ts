import {
  expectedIntegerErrorContract,
  expectedNotNullObjectErrorContract,
  LayoutResult,
  missingObjectPropertyErrorContract,
  notMatchedErrorContract,
} from "@acme/layout/runtime/mod.ts";
import { parseResourceTarget, ResourceTarget } from "./resource-target.layout.compiled.ts";
import { parseResourceType, ResourceType } from "./resource-type.layout.compiled.ts";

export interface ResourceUpdateC2SReqDTO {
  /** The type of a resource */
  type: ResourceType;
  /** The target of a resource */
  target: ResourceTarget;
  /** The amount of resources to update */
  count: number;
}

export const schemaResourceUpdateC2SReqDTO = {
  "type": "object",
  "properties": {
    "type": {
      "description": "The type of a resource",
      "enum": [
        "points",
        "gold",
        "steel",
        "titan",
        "plant",
        "energy",
        "heat",
      ],
    },
    "target": {
      "description": "The target of a resource",
      "enum": [
        "amount",
        "production",
      ],
    },
    "count": {
      "type": "integer",
      "description": "The amount of resources to update",
    },
  },
  "required": [
    "type",
    "target",
    "count",
  ],
  "additionalProperties": false,
};
export const parseResourceUpdateC2SReqDTO = (
  data: unknown,
  path: string = "",
): LayoutResult<ResourceUpdateC2SReqDTO> => {
  let output;
  while (true) {
    if (typeof data === "object") {
      if (data === null) {
        return [false, expectedNotNullObjectErrorContract, path, ""];
      }

      // Parsing property "type"
      const input_type = "type" in data === true ? data.type : undefined;
      if (input_type === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "type"];
      }
      let output_type;
      while (true) {
        const result_type = parseResourceType(input_type);
        if (result_type[0] === true) {
          output_type = result_type[1];
          break;
        }
        return [false, notMatchedErrorContract, path, "type"];
      }

      // Parsing property "target"
      const input_target = "target" in data === true ? data.target : undefined;
      if (input_target === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "target"];
      }
      let output_target;
      while (true) {
        const result_target = parseResourceTarget(input_target);
        if (result_target[0] === true) {
          output_target = result_target[1];
          break;
        }
        return [false, notMatchedErrorContract, path, "target"];
      }

      // Parsing property "count"
      const input_count = "count" in data === true ? data.count : undefined;
      if (input_count === undefined) {
        return [false, missingObjectPropertyErrorContract, path, "count"];
      }
      let output_count;
      while (true) {
        if (typeof input_count === "number") {
          if (Number.isInteger(input_count) === false) {
            return [false, expectedIntegerErrorContract, path, "count"];
          }
          output_count = input_count;
          break;
        }
        return [false, notMatchedErrorContract, path, "count"];
      }
      output = {
        type: output_type,
        target: output_target,
        count: output_count,
      };
      break;
    }
    return [false, notMatchedErrorContract, path, ""];
  }
  return [true, output];
};
