import { Store } from "../../common/frontend-framework/store.ts";
import { button_text, div_nodes, div_text, img_props, span_text } from "../../common/frontend-framework/dom.ts";
import { Resource, resourcesByType } from "../../common/resources.ts";
import { ResourceTarget, ResourceType } from "../../common/resources.ts";
import { onClick } from "../../apps/client/features/common.ts";
import { withResolvers } from "../../common/useful.ts";

export function createCalculatorButton(digit: number) {
  const root = button_text("box _button _project", digit.toString());
  root.dataset.digit = digit.toString();
  return root;
}

export interface SupplyModalOptions {
  target: ResourceTarget;
  type: ResourceType;
  current: number;
}

export class CalculatorStore extends Store {
  public digits = "0";
  public positive = true;

  public append(digit: string) {
    if (this.digits.length >= 3) {
      return;
    }
    this.digits = this.digits === "0" ? digit : `${this.digits}${digit}`;
    this.emit();
  }

  public clear() {
    this.digits = "0";
    this.positive = true;
    this.emit();
  }

  public reverse() {
    this.positive = !this.positive;
    this.emit();
  }

  public getValue(): number {
    return parseInt(this.digits) * (this.positive ? 1 : -1);
  }
}

export interface SupplyModalConfirmResponse {
  type: "confirm";
  value: number;
  resource: Resource;
}

export interface SupplyModalCancelResponse {
  type: "cancel";
}

export type SupplyModalResponse = SupplyModalConfirmResponse | SupplyModalCancelResponse;

export function createSupplyModal(options: Resource) {
  const { target, type, count } = options;
  const min = resourcesByType[type].targets[target].min;

  const $input = div_text("box _counter _wide", "0");
  const $cancel = button_text("box _button", "Cancel");
  const $confirm = button_text("box _button", "Confirm");
  const $operator = button_text("box _button _project", "-");
  const $clear = button_text("box _button _project", "C");

  const $calculator = div_nodes("calculator", [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(createCalculatorButton),
    $operator,
    createCalculatorButton(0),
    $clear,
  ]);

  const $root = div_nodes("modal", [
    div_nodes("modal_background", [
      div_nodes("modal_container", [
        div_text("modal_title", `Change your ${target}:`),
        div_nodes("modal_target", [
          div_nodes(`modal_target-supply _${target}`, [
            div_text("box _counter", count.toString()),
          ]),
          img_props({
            className: "modal_target-icon",
            width: "64",
            height: "64",
            alt: "supply-icon",
            src: `/images/supplies/${type}.svg`,
          }),
        ]),
        div_nodes("modal_count", [
          span_text("modal_count-label _left", "by"),
          $input,
          span_text("modal_count-label _right", "units"),
        ]),
        $calculator,
        div_nodes("modal_buttons", [
          $cancel,
          $confirm,
        ]),
      ]),
    ]),
  ]);

  const store = new CalculatorStore();
  store.on((store) => {
    const { digits, positive } = store;
    $input.textContent = `${positive ? "" : "-"}${digits}`;
    $operator.textContent = positive ? "-" : "+";
    const valid = count + store.getValue() < min;
    $confirm.toggleAttribute("disabled", valid);
  });

  onClick($calculator, (event) => {
    const $target = event.target as HTMLElement;
    const digit = $target.dataset.digit;
    if (digit === undefined) {
      return;
    }
    store.append(digit);
  });

  onClick($operator, () => store.reverse());
  onClick($clear, () => store.clear());

  const { promise, resolve } = withResolvers<SupplyModalResponse>();

  onClick($cancel, () => {
    resolve({ type: "cancel" });
  });

  onClick($confirm, () => {
    resolve({
      type: "confirm",
      value: store.getValue(),
      resource: options,
    });
  });

  return { promise, $root, store };
}
