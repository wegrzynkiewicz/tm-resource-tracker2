import { comment } from "@acme/dom/nodes.ts";
import { Channel } from "@acme/dom/channel.ts";

export type SlotNode = Comment | Element | Text;

export class Slot {
  public readonly $anchor: Comment;
  public $root: SlotNode;
  public readonly attached = new Channel<[SlotNode, Slot]>();
  public readonly detached = new Channel<[SlotNode, Slot]>();

  public constructor(
    public readonly description: string,
  ) {
    this.$anchor = comment(description);
    this.$root = this.$anchor;
  }

  public attach($node: Comment | Element) {
    if (this.$root === $node) {
      return;
    }
    this.$root.replaceWith($node);
    this.detached.emit(this.$root, this);
    this.$root = $node;
    this.attached.emit($node, this);
  }

  public detach() {
    this.attach(this.$anchor);
  }
}
