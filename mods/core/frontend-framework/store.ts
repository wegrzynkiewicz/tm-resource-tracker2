import { Subscriber } from "@acme/dependency/channel.ts";

export class Store {
  public readonly subscribers = new Set<Subscriber<[this]>>();

  public on(subscribe: (store: this) => void) {
    this.subscribers.add({ subscribe });
    subscribe(this);
  }

  public emit() {
    for (const subscriber of this.subscribers) {
      subscriber.subscribe(this);
    }
  }
}

// export class Collection<TItem> {
//   public readonly updates = new Channel<TItem[]>();
//   public constructor(
//     public readonly items: TItem[],
//   ) {}
//   public update() {
//     this.updates.emit(this.items);
//   }
// }

// export class Signal<TValue> {
//   public readonly handlers = new Set<ShortHandler<TValue>>();

//   public constructor(
//     public value: TValue,
//   ) {}

//   public on(handler: ShortHandler<TValue>) {
//     this.handlers.add(handler);
//     handler(this.value);
//   }

//   public update(value: TValue) {
//     this.value = value;
//     this.emit();
//   }

//   public emit() {
//     for (const handler of this.handlers) {
//       handler(this.value);
//     }
//   }
// }
