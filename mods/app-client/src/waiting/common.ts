import { definePath } from "@acme/endpoint/path.ts";
import { defineController } from "../controller.ts";
import { initWaitingController } from "./waiting.entry.ts";

export const waitingPathContract = definePath({
  params: [],
  path: "/waiting",
});

export const waitingControllerContract = defineController({
  name: "waiting",
  path: waitingPathContract,
  importer: async () => {
    return initWaitingController;
  }
});
