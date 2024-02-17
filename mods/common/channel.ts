export type ShortHandler<TEvent> = (event: TEvent) => void;

export interface Handler<TEvent> {
  handle(event: TEvent): void
}

export class Channel<TEvent> {
  public readonly handlers = new Set<Handler<TEvent>>();
  
  public on(handle: ShortHandler<TEvent>) {
    this.handlers.add({ handle });
  }

  public emit(event: TEvent) {
    for (const handler of this.handlers) {
      handler.handle(event);
    }
  }
}
