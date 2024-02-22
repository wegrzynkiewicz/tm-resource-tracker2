export interface ClientConfig {
  readonly apiUrl: string;
  readonly title: string;
  readonly wsURL: string;
}

export function provideClientConfig() {
  return {
    apiUrl: "http://localhost:3008",
    title: "TM Resource Tracker v2",
    wsURL: "ws://localhost:3008",
  };
}
