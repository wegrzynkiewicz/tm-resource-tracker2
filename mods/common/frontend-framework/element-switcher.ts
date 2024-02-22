import { Breaker } from "../asserts.ts";

export class ElementSwitcher {
  public readonly elements = new Map<string, Node>();
  public constructor(
    private readonly root: Element,
  ) {}

  public switch(key: string) {
    const element = this.elements.get(key);
    if (element === undefined) {
      throw new Breaker("not-found-element-to-switch", { key });
    }
    this.root.replaceChildren(element);
  }
}
