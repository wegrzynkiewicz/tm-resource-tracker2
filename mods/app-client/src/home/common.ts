import { definePath } from "@acme/endpoint/path.ts";
import { defineController } from "../controller.ts";
import { initHomeController } from "./home.entry.ts";

export const homePathContract = definePath({
  params: [],
  path: "/",
});

export const homeControllerContract = defineController({
  name: "home",
  path: homePathContract,
  importer: async () => {
    return initHomeController;
  }
});
