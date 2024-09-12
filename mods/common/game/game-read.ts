import { definePath } from "@acme/endpoint/path.ts";
import { defineRequest } from "@acme/endpoint/request.ts";
import { defineJSONPayload } from "@acme/endpoint/payload-json.ts";
import { defineResponse } from "@acme/endpoint/response.ts";
import { defineEndpoint } from "@acme/endpoint/endpoint.ts";
import { internalErrorResponseContract } from "@acme/endpoint/build-in/errors.ts";
import { gameLayout } from "./defs.ts";

export const gameReadPathContract = definePath({
  params: [],
  path: "/games/read",
});

export const gameReadRequestContract = defineRequest({
  method: "GET",
  path: gameReadPathContract,
  payload: null
});

export const gameReadResponseContract = defineResponse({
  description: "Game read successfully",
  payload: defineJSONPayload({
    layout: gameLayout,
  }),
  status: 200,
});

export const gameReadEndpointContract = defineEndpoint({
  id: "game-read",
  description: "Read a new game",
  request: gameReadRequestContract,
  responses: [
    internalErrorResponseContract,
    gameReadResponseContract,
  ],
});
