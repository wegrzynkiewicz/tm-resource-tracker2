export type Subscriber<TEvent> = (event: TEvent) => void;

export class Channel<TEvent> {
  public readonly subscribers = new Set<Subscriber<TEvent>>();
  public dispatch(event: TEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}
