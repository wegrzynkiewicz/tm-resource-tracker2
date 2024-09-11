import { definePath } from "@acme/endpoint/path.ts";
import { defineController } from "../controller.ts";

export const homePathContract = definePath({
  params: [],
  path: "/",
});

export const homeControllerContract = defineController({
  path: homePathContract,
  importer: async () => {
    const { initHomeController } = await import("./home.entry.ts");
    return initHomeController;
  }
});
