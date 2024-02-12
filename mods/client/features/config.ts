export interface ClientConfig {
  readonly apiUrl: string;
}

export function provideClientConfig() {
  return {
    apiUrl: "http://localhost:3008",
  };
}
