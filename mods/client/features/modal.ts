import { div_empty } from "../../frontend-framework/dom.ts";

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
  public readonly root = div_empty("app_content-overlay");

  public mount(modal: Modal<unknown>) {
    this.root.classList.add("_enabled");
    this.root.appendChild(modal.$root);
    modal.promise.then(() => {
      this.root.removeChild(modal.$root);
      this.root.classList.remove("_enabled");
    });
  }
}

export const modalManager = new ModalManager();
