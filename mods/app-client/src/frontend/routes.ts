import { ControllerImporter, NaiveControllerRouter } from "../controller.ts";
import { initHomeController } from "./home/home.entry.ts";
import { PlayingView } from "./playing/playing-view.layout.compiled.ts";
import { initPlayingController } from "./playing/playing.entry.ts";
import { initWaitingController } from "./waiting/waiting.entry.ts";

export const homePath = "/";
export const waitingPath = "/waiting";
export const playingPathname = "/playing/:view";
export const playingPathFactory = (view: PlayingView) => `/playing/${view}`;

export const homeControllerImporter: ControllerImporter = async () => initHomeController;
export const waitingControllerImporter: ControllerImporter = async () => initWaitingController;
export const playingControllerImporter: ControllerImporter = async () => initPlayingController;

export function initControllerRouter() {
  const router = new NaiveControllerRouter();
  router.addRoute(homePath, homeControllerImporter);
  router.addRoute(waitingPath, waitingControllerImporter);
  router.addRoute(playingPathname, playingControllerImporter);
  return router;
}
