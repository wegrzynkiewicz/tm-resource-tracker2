import { definePath } from "@acme/endpoint/path.ts";
import { defineController } from "../controller.ts";

export const waitingPathContract = definePath({
  params: [],
  path: "/waiting",
});

export const waitingControllerContract = defineController({
  name: "waiting",
  path: waitingPathContract,
  importer: async () => {
    const { initWaitingController } = await import("./waiting.entry.ts");
    return initWaitingController;
  }
});
