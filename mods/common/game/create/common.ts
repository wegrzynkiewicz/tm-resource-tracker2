import { definePath } from "@acme/endpoint/path.ts";
import { defineRequest } from "@acme/endpoint/request.ts";
import { defineJSONPayload } from "@acme/endpoint/payload-json.ts";
import { myPlayerUpdateLayout, playerLayout } from "../../player/common.ts";
import { ObjectLayout } from "@acme/layout/types/object-layout.ts";
import { StringLayout } from "@acme/layout/types/string-layout.ts";
import { InferLayout } from "@acme/layout/common.ts";
import { defineResponse } from "@acme/endpoint/response.ts";
import { defineEndpoint } from "@acme/endpoint/endpoint.ts";
import { internalErrorResponseContract } from "@acme/endpoint/build-in/errors.ts";

export const gameLayout = new ObjectLayout(
  { summary: "Game object" },
  {
    gameId: new StringLayout({ summary: "Game identifier" }),
    player: playerLayout,
    token: new StringLayout({ summary: "Token" }),
  },
  [],
);

export type Game = InferLayout<typeof gameLayout>;

export const gameCreatePathContract = definePath({
  params: [],
  path: "/games/create",
});

export const gameCreateRequestContract = defineRequest({
  method: "POST",
  path: gameCreatePathContract,
  payload: defineJSONPayload({
    layout: myPlayerUpdateLayout,
  }),
});

export const gameCreateResponseContract = defineResponse({
  description: "Game created successfully",
  payload: defineJSONPayload({
    layout: gameLayout,
  }),
  status: 200,
});

export const gameCreateEndpointContract = defineEndpoint({
  id: "game-create",
  description: "Create a new game",
  request: gameCreateRequestContract,
  responses: [
    internalErrorResponseContract,
    gameCreateResponseContract,
  ],
});
