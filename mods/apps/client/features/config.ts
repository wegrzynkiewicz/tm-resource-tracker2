export interface ClientConfig {
  readonly apiUrl: string;
  readonly wsURL: string;
}

export function provideClientConfig() {
  return {
    apiUrl: "http://localhost:3008",
    wsURL: "ws://localhost:3008",
  };
}

export function provideTitle() {
  return "TM Resource Tracker v2";
}
