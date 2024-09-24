import { sleep } from "../../core/useful.ts";
import { defineDependency } from "@acme/dependency/declaration.ts";
import { button, comment, div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { frontendScopeContract } from "../bootstrap.ts";

export interface Modal<T = unknown> {
  $root: HTMLElement;
  ready: Promise<T>;
}

export function createQuestionModal(
  { confirmText = "Confirm", titleText }: {
    confirmText?: string;
    titleText: string;
  }
) {
  const $cancel = button("box _button", "Cancel");
  const $confirm = button("box _button", confirmText);

  const $root = form_nodes("modal", [
    div_nodes("modal_container", [
      div("modal_title", titleText),
      div_nodes("modal_buttons", [
        $cancel,
        $confirm,
      ]),
    ]),
  ]);

  const { promise, resolve } = Promise.withResolvers<boolean>();
  const createClickListener = (result: boolean) => {
    return (event: Event) => {
      event.preventDefault();
      resolve(result);
    }
  }
  $confirm.addEventListener("click", createClickListener(true));
  $cancel.addEventListener("click", createClickListener(false));

  return { ready: promise, $root };
}

export class ModalManager {
  public readonly $root = comment("modal-manager-anchor");
  public readonly $overlay = div("app_content-overlay");
  public readonly style = getComputedStyle(this.$overlay);

  public async mount(modal: Modal) {
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
  name: "modal-manager",
  provider: provideModalManager,
  scope: frontendScopeContract,
});
