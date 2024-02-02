export type Subscriber<TEvent> = (event: TEvent) => void;

export class Channel<TEvent> {
  public readonly subscribers = new Set<Subscriber<TEvent>>();
  public on(subscriber: Subscriber<TEvent>) {
    this.subscribers.add(subscriber);
  }
  public emit(event: TEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}

export class Store {
  public readonly updates = new Channel<this>();

  public on(subscriber: Subscriber<this>) {
    this.updates.on(subscriber);
    subscriber(this);
  }

  public emit() {
    this.updates.emit(this);
  }
}

export class Signal<TValue> {
  public readonly updates = new Channel<TValue>();

  public constructor(
    public value: TValue
  ) { }

  public on(subscriber: Subscriber<TValue>) {
    this.updates.on(subscriber);
    subscriber(this.value);
  }

  public emit() {
    this.updates.emit(this.value);
  }
}
