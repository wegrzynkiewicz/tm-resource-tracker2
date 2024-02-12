import { ServiceResolver } from "../common/dependency.ts";
import { provideAppView } from "./features/app/app.ts";
import { provideClientGameManager } from "./features/game/manager.ts";

async function start() {
  const resolver = new ServiceResolver();
  const app = resolver.resolve(provideAppView);
  document.body.appendChild(app.$root);
  const game = resolver.resolve(provideClientGameManager);
  await game.bootstrap();
}
start();
