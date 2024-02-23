import { Breaker } from "../asserts.ts";

export class ChildSwitcher {
  public readonly nodes = new Map<string, Node>();

  public constructor(
    private readonly root: Element,
  ) { }

  public switch(key: string) {
    const element = this.nodes.get(key);
    if (element === undefined) {
      throw new Breaker("not-found-element-to-switch", { key });
    }
    this.root.replaceChildren(element);
  }
}
