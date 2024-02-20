import { div_empty } from "./dom.ts";
import { Collection } from "./store.ts";

export interface ComponentFactory<TItem> {
  create(item: TItem): HTMLElement;
}

export class Loop<TItem extends WeakKey> {
  public readonly nodes = new WeakMap<TItem, HTMLElement>();
  public constructor(
    public readonly $root: HTMLElement,
    public readonly collection: Collection<TItem>,
    public readonly factory: ComponentFactory<TItem>,
  ) {
    collection.updates.on(() => { this.update(); });
    this.update();
  }

  public update() {
    const nodes = this.collection.items.map((item) => {
      const node = this.nodes.get(item);
      if (node === undefined) {
        const node = this.factory.create(item);
        this.nodes.set(item, node);
        return node;
      }
      return node;
    });
    this.$root.replaceChildren(...nodes);
  }

  public static create<TItem extends WeakKey>(
    collection: Collection<TItem>,
    factory: ComponentFactory<TItem>,
  ) {
    const $root = div_empty("");
    return new Loop($root, collection, factory);
  }
}
