export interface ClientConfig {
  readonly apiUrl: string;
  readonly title: string;
}

export function provideClientConfig() {
  return {
    apiUrl: "http://localhost:3008",
    title: "TM Resource Tracker v2",
  };
}
