export type Listener<TEvent> = (event: TEvent) => void;

export class Channel<TEvent> {
  public readonly listeners = new Set<Listener<TEvent>>();
  public on(listener: Listener<TEvent>) {
    this.listeners.add(listener);
  }
  public emit(event: TEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export class Store {
  public readonly listeners = new Set<Listener<this>>();

  public on(listener: Listener<this>) {
    this.listeners.add(listener);
  }

  public emit() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }
}

export class Signal<TValue> {
  public readonly listeners = new Set<Listener<TValue>>();

  public constructor(
    public value: TValue,
  ) {}

  public on(listener: Listener<TValue>) {
    this.listeners.add(listener);
    listener(this.value);
  }

  public emit() {
    for (const listener of this.listeners) {
      listener(this.value);
    }
  }
}
