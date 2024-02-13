import { Channel } from "../../common/channel.ts";
import { Logger } from "../logger/global.ts";

export class WebSocketChannel {

  public readonly opens = new Channel();
  public readonly closes = new Channel();
  public readonly messages = new Channel();
  public readonly errors = new Channel();

  public constructor(
    public readonly logger: Logger,
    public readonly ws: WebSocket,
  ) {
    ws.addEventListener("open", (event: Event) => {
      this.logger.silly("open-web-socket-channel");
      try {
        this.opens.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-open-listener", { error });
      }
    });

    ws.addEventListener("close", (event: CloseEvent) => {
      this.logger.silly("close-web-socket-channel");
      try {
        this.closes.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-close-listener", { error });
      }
    });

    ws.addEventListener("message", (event: MessageEvent) => {
      this.logger.silly("message-web-socket-channel");
      try {
        this.messages.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-message-listener", { error });
      }
    });

    ws.addEventListener("error", (event: Event) => {
      this.logger.silly("error-web-socket-channel");
      try {
        this.errors.emit(event);
      } catch (error) {
        this.logger.error("error-inside-web-socket-channel-error-listener", { error });
      }
    });
  }

  public close(): void {
    this.ws.close();
  }
}
