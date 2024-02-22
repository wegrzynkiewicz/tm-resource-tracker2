import { createGlobalContext } from "../../common/global.ts";
import { provideWebServer } from "./main-web-server.ts";

async function start() {
  const { resolver } = createGlobalContext();
  const server = resolver.resolve(provideWebServer);
  await server.listen();
}
start();
