import { Channel } from "../common/channel.ts";
import { withResolvers } from "../common/useful.ts";
import { Logger } from "../logger/global.ts";

export function readyStateToString(readyState: number): string {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return "CONNECTING";
    case WebSocket.OPEN:
      return "OPEN";
    case WebSocket.CLOSING:
      return "CLOSING";
    case WebSocket.CLOSED:
      return "CLOSED";
    default:
      return "UNKNOWN";
  }
}

export class WebSocketChannel {

  public readonly ready: Promise<void>;

  public readonly opens = new Channel();
  public readonly closes = new Channel();
  public readonly messages = new Channel();
  public readonly errors = new Channel();

  public constructor(
    public readonly logger: Logger,
    public readonly ws: WebSocket,
  ) {

    const open = withResolvers<void>();
    this.ready = open.promise;
    
    ws.addEventListener("open", (event: Event) => {
      const readyState = readyStateToString(ws.readyState);
      this.logger.silly("open-web-socket-channel", { readyState });
      open.resolve();
      try {
        this.opens.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-open-listener", { error, readyState });
      }
    });

    ws.addEventListener("close", (event: CloseEvent) => {
      const readyState = readyStateToString(ws.readyState);
      const { code, reason } = event;
      this.logger.silly("close-web-socket-channel", { code, readyState, reason });
      try {
        this.closes.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-close-listener", { code, error, readyState, reason });
      }
    });

    ws.addEventListener("message", (event: MessageEvent) => {
      const readyState = readyStateToString(ws.readyState);
      const data = typeof event.data === "string" ? event.data : "binary";
      this.logger.silly("incoming-message-web-socket-channel", { data, readyState });
      try {
        this.messages.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-message-listener", { data, error, readyState });
      }
    });

    ws.addEventListener("error", (event: Event) => {
      const readyState = readyStateToString(ws.readyState);
      this.logger.silly("error-web-socket-channel", { readyState });
      try {
        this.errors.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-error-listener", { error, readyState });
      }
    });
  }

  public send(data: string): void {
    const readyState = readyStateToString(this.ws.readyState);
    this.logger.silly("outgoing-message-web-socket-channel", { data, readyState });
    this.ws.send(data);
  }

  public close(): void {
    this.ws.close();
  }
}
