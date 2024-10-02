import { ControllerImporter } from "../../controller.ts";
import { initWaitingController } from "./waiting.entry.ts";

export const waitingPath = "/waiting";
export const waitingControllerImporter: ControllerImporter = async () => {
  return initWaitingController;
};
