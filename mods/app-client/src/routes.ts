import { NaiveControllerRouter } from "./controller.ts";
import { initHomeController } from "./home/home.entry.ts";
import { PlayingView } from "./playing/playing-view.layout.compiled.ts";
import { initPlayingController } from "./playing/playing.entry.ts";
import { initWaitingController } from "./waiting/waiting.entry.ts";

export const homePath = "/";
export const waitingPath = "/waiting";
export const playingPathname = "/playing/:view";
export const playingPathFactory = (view: PlayingView) => `/playing/${view}`;

export function initControllerRouter() {
  const router = new NaiveControllerRouter();
  router.addRoute(homePath, async () => initHomeController);
  router.addRoute(waitingPath, async () => initWaitingController);
  router.addRoute(playingPathname, async () => initPlayingController);
  return router;
}
