import { sleep } from "../../common/useful.ts";
import { comment, div_empty } from "../../frontend-framework/dom.ts";

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
  promise: Promise<ModalResponse<TValue>>;
}

export class ModalManager {
  public readonly $root = comment('modal-manager-anchor');
  public readonly $overlay = div_empty("app_content-overlay");
  public readonly style = getComputedStyle(this.$overlay);

  public async mount(modal: Modal<unknown>) {
    const { $root, $overlay } = this;
    $root.after($overlay);
    await sleep(1);
    $overlay.classList.add("_enabled");
    $overlay.appendChild(modal.$root);
    await modal.promise;
    $overlay.classList.remove("_enabled");
    await sleep(200);
    $overlay.replaceChildren();
    $overlay.remove();
  }
}

export function provideModalManager() {
  return new ModalManager();
}
