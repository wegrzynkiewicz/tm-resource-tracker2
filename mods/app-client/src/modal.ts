import { sleep } from "../../core/useful.ts";
import { defineDependency } from "@acme/dependency/injection.ts";
import { comment, div } from "@acme/dom/nodes.ts";

export interface ModalConfirmResponse<TValue> {
  type: "confirm";
  value: TValue;
}

export interface ModalCancelResponse {
  type: "cancel";
}

export type ModalResponse<TValue> = ModalConfirmResponse<TValue> | ModalCancelResponse;

export interface Modal<TValue> {
  $root: HTMLElement;
  ready: Promise<ModalResponse<TValue>>;
}

export class ModalManager {
  public readonly $root = comment("modal-manager-anchor");
  public readonly $overlay = div("app_content-overlay");
  public readonly style = getComputedStyle(this.$overlay);

  public async mount(modal: Modal<unknown>) {
    const { $root, $overlay } = this;
    $root.after($overlay);
    await sleep(1);
    $overlay.classList.add("_enabled");
    $overlay.appendChild(modal.$root);
    await modal.ready;
    $overlay.classList.remove("_enabled");
    await sleep(200);
    $overlay.replaceChildren();
    $overlay.remove();
  }
}

export function provideModalManager() {
  return new ModalManager();
}
export const modalManagerDependency = defineDependency({
  kind: "modal-manager",
  provider: provideModalManager,
});
