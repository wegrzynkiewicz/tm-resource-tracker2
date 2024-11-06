import { defineDependency } from "@acme/dependency/declaration.ts";
import { button, comment, div, div_nodes, form_nodes } from "@acme/dom/nodes.ts";
import { frontendScopeToken } from "./defs.ts";
import { deferred, sleep } from "@acme/useful/async.ts";

export interface Modal<T = unknown> {
  $root: HTMLElement;
  ready: Promise<T>;
}

export function createQuestionModal(
  { confirmText = "Confirm", titleText }: {
    confirmText?: string;
    titleText: string;
  },
) {
  const $cancel = button("box _button", "Cancel");
  $cancel.type = "button";

  const $confirm = button("box _button", confirmText);
  $confirm.type = "button";

  const $root = form_nodes("modal", [
    div_nodes("modal_container", [
      div("modal_title", titleText),
      div_nodes("modal_buttons", [
        $cancel,
        $confirm,
      ]),
    ]),
  ]);

  const { promise, resolve } = deferred<boolean>();
  $confirm.addEventListener("click", () => resolve(true));
  $cancel.addEventListener("click", () => resolve(false));

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
  provider: provideModalManager,
  scopeToken: frontendScopeToken,
});
