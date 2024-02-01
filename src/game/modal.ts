import { div_empty } from "../common/dom.ts";

export interface Modal {
  $root: HTMLElement;
  promise: Promise<unknown>;
}

export class ModalManager {
  public readonly root = div_empty('app_content-overlay');

  public mount(modal: Modal) {
    this.root.classList.add("_enabled");
    this.root.appendChild(modal.$root);
    modal.promise.then(() => {
      this.root.removeChild(modal.$root);
      this.root.classList.remove("_enabled");
    });
  }
}

export const modalManager = new ModalManager();
