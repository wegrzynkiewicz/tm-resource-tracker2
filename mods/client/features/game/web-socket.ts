import { Breaker } from "../../../common/asserts.ts";

export function provideWebSocket(): WebSocket {
  throw new Breaker('web-socket-must-be-injected');
}
