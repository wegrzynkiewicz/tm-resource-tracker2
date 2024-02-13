import { Handler } from "../common/channel.ts";

export class Store {
  public readonly handlers = new Set<Handler<this>>();

  public on(handler: Handler<this>) {
    this.handlers.add(handler);
  }

  public emit() {
    for (const handler of this.handlers) {
      handler(this);
    }
  }
}

export class Signal<TValue> {
  public readonly handlers = new Set<Handler<TValue>>();

  public constructor(
    public value: TValue,
  ) {}

  public on(handler: Handler<TValue>) {
    this.handlers.add(handler);
    handler(this.value);
  }

  public emit() {
    for (const handler of this.handlers) {
      handler(this.value);
    }
  }
}
