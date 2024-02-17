import { ShortHandler } from "../common/channel.ts";

export class Store {
  public readonly handlers = new Set<ShortHandler<this>>();

  public on(handler: ShortHandler<this>) {
    this.handlers.add(handler);
  }

  public emit() {
    for (const handler of this.handlers) {
      handler(this);
    }
  }
}

export class Signal<TValue> {
  public readonly handlers = new Set<ShortHandler<TValue>>();

  public constructor(
    public value: TValue,
  ) {}

  public on(handler: ShortHandler<TValue>) {
    this.handlers.add(handler);
    handler(this.value);
  }

  public emit() {
    for (const handler of this.handlers) {
      handler(this.value);
    }
  }
}
