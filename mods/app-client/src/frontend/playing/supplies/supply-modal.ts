import { Resource, ResourceTarget } from "@common/resources.ts";
import { button, div, div_nodes, span } from "@acme/dom/nodes.ts";
import { Channel } from "@acme/dom/channel.ts";
import { deferred } from "@acme/useful/async.ts";
import { Result } from "@acme/useful/result.ts";
import { createSupplyIcon } from "./defs.ts";

export class CalculatorStore {
  public updates = new Channel<[]>();
  public digits = "0";
  public positive = true;

  public append(digit: string) {
    if (this.digits.length >= 3) {
      return;
    }
    this.digits = this.digits === "0" ? digit : `${this.digits}${digit}`;
    this.updates.emit();
  }

  public clear() {
    this.digits = "0";
    this.positive = true;
    this.updates.emit();
  }

  public reverse() {
    this.positive = !this.positive;
    this.updates.emit();
  }

  public getNumber(): number {
    return parseInt(this.digits) * (this.positive ? 1 : -1);
  }

  public getValue(): string {
    return `${this.positive ? "" : "-"}${this.digits}`;
  }
}

export function createCalculatorButton(digit: number) {
  const root = button("box _button _project", digit.toString());
  root.dataset.digit = digit.toString();
  return root;
}

export interface SupplyModalOptions {
  count: number;
  resource: Resource;
  target: ResourceTarget;
}

export function createSupplyModal(options: SupplyModalOptions) {
  const { target, resource: { type, minProduction }, count } = options;

  const $input = div("box _counter _wide", "0");
  const $cancel = button("box _button", "Cancel");
  const $confirm = button("box _button", "Confirm");
  const $operator = button("box _button _project", "-");
  const $clear = button("box _button _project", "C");

  const $calculator = div_nodes("calculator", [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(createCalculatorButton),
    $operator,
    createCalculatorButton(0),
    $clear,
  ]);

  const $root = div_nodes("modal", [
    div_nodes("modal_container", [
      div("modal_title", `Change your ${target}:`),
      div_nodes("modal_target", [
        div_nodes(`modal_target-supply _${target}`, [
          div("box _counter", count.toString()),
        ]),
        createSupplyIcon(type),
      ]),
      div_nodes("modal_count", [
        span("modal_count-label _left", "by"),
        $input,
        span("modal_count-label _right", "units"),
      ]),
      $calculator,
      div_nodes("modal_buttons", [
        $cancel,
        $confirm,
      ]),
    ]),
  ]);

  const store = new CalculatorStore();
  const update = () => {
    $input.textContent = store.getValue();
    $operator.textContent = store.positive ? "-" : "+";
    const valid = count + store.getNumber() < minProduction;
    $confirm.toggleAttribute("disabled", valid);
  }
  store.updates.on(update);
  update();

  $calculator.addEventListener("click", (event) => {
    const $target = event.target as HTMLElement;
    const digit = $target.dataset.digit;
    if (digit === undefined) {
      return;
    }
    store.append(digit);
  });

  $operator.addEventListener("click", () => store.reverse());
  $clear.addEventListener("click", () => store.clear());

  const defer = deferred<Result<number, undefined>>();
  $cancel.addEventListener("click", () => defer.resolve([false, undefined]));
  $confirm.addEventListener("click", () => defer.resolve([true, store.getNumber()]));

  return { $root, ready: defer.promise };
}
