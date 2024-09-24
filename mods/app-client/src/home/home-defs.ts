import { ControllerImporter } from "../controller.ts";
import { initHomeController } from "./home.entry.ts";

export const homePath = "/";
export const homeControllerImporter: ControllerImporter = async () => {
  return initHomeController;
} 
