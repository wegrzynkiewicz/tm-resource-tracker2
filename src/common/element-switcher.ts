import { Breaker } from "../asserts.ts";

export class ElementSwitcher {
  private currentElement?: Element;
  public readonly elements = new Map<string, Element>();
  public constructor(
    private readonly root: Element,
  ) { }

  public switch(key: string) {
    const element = this.elements.get(key);
    if (element === undefined) {
      throw new Breaker("not-found-element-to-switch", { key });
    }
    if (this.currentElement === element) {
      return;
    }
    if (this.currentElement) {
      this.currentElement.remove();
    }
    this.root.appendChild(element);
    this.currentElement = element;
  }
}
