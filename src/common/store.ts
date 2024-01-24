export type Subscriber<TEvent> = (event: TEvent) => void;

export class Channel<TEvent> {
  public readonly subscribers = new Set<Subscriber<TEvent>>();
  public dispatch(event: TEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}

export class Store {
  public readonly updates = new Channel<this>();
  public update() {
    this.updates.dispatch(this);
  }
}

export class Signal<TValue> extends Store {
  public constructor(public value: TValue) { 
    super();
  }
}
