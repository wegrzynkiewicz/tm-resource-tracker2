import { createGlobalContext } from "../../common/global.ts";
import { provideAppView } from "./features/app/app.ts";
import { provideClientGameManager } from "./features/game/manager.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const app = resolver.resolve(provideAppView);
  document.body.appendChild(app.$root);
  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
