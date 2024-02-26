import { comment } from "../../../common/frontend-framework/dom.ts";

export class Place {
  public $root: Comment | Element;

  public constructor(
    public readonly description: string
  ) {
    this.$root = comment(description);
  }

  public attach($root: Comment | Element) {
    if (this.$root === $root) {
      return;
    }
    this.$root.replaceWith($root);
    this.$root = $root;
  }
}

export function provideAppPlace() {
  const place = new Place('body')
  document.body.appendChild(place.$root)
  return place;
}
