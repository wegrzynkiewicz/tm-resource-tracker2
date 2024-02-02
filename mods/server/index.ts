import { ServiceResolver } from "../common/dependency.ts";
import { provideWebServer } from "./main-web-server.ts";

const resolver = new ServiceResolver();
const server = resolver.resolve(provideWebServer);
await server.listen();
