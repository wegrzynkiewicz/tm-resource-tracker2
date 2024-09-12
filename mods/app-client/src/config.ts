import { defineDependency } from "@acme/dependency/declaration.ts";

export interface ClientConfig {
  readonly apiUrl: string;
  readonly wsURL: string;
}

export function provideClientConfig() {
  return {
    apiUrl: "http://localhost:3008",
    wsURL: "ws://192.168.1.105:3008",
  };
}
export const clientConfigDependency = defineDependency({
  name: "client-config",
  provider: provideClientConfig,
});
