export type Handler<TEvent> = (event: TEvent) => void;

export class Channel<TEvent> {
  public readonly handlers = new Set<Handler<TEvent>>();
  public on(handler: Handler<TEvent>) {
    this.handlers.add(handler);
  }
  public emit(event: TEvent) {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
