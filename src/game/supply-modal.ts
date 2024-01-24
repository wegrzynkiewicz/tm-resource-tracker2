import { assertRequiredString } from "../asserts.ts";
import { mapToFragment } from "../common.ts";
import { Store } from "../common/store.ts";
import { button_text, div_nodes, div_text, img_props, span_text } from "../common/dom.ts";
import { Resource, resourcesByType } from "../data/resources.ts";
import { ResourceTarget, ResourceType } from "../data/resources.ts";

export function createCalculatorButton(digit: number) {
  const root = button_text('box --button --project', digit.toString())
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
  }
  public getValue(): number {
    return parseInt(this.digits) * (this.positive ? 1 : -1);
  }
}

export interface SupplyModalConfirmResponse {
  type: 'confirm',
  value: number;
  resource: Resource;
}

export interface SupplyModalCancelResponse {
  type: 'cancel',
}

export type SupplyModalResponse = SupplyModalConfirmResponse | SupplyModalCancelResponse;;

export function createSupplyModal(options: Resource) {
  const { target, type, count } = options;
  const min = resourcesByType[type].targets[target].min;

  const input = div_text('box --counter --wide', "0");
  const cancel = button_text('box --button', 'Cancel');
  const confirm = button_text('box --button', 'Confirm');
  const operator = button_text('box --button --project', '-');
  const clear = button_text('box --button --project', 'C');

  const calculator = div_nodes('calculator', [
    mapToFragment([1, 2, 3, 4, 5, 6, 7, 8, 9], createCalculatorButton),
    operator,
    createCalculatorButton(0),
    clear,
  ]);

  const root = div_nodes("modal", [
    div_nodes("modal__background", [
      div_nodes("modal__container", [
        div_text('modal__title', `Change you ${target}:`),
        div_nodes('modal__target', [
          div_nodes(`modal__target-supply --${target}`, [
            div_text('box --counter', count.toString()),
          ]),
          img_props({
            className: 'modal__target-icon',
            width: "64",
            height: "64",
            alt: "supply-icon",
            src: `/images/supplies/${type}.svg`,
          }),
        ]),
        div_nodes('modal__count', [
          span_text('modal__count-label --left', 'by'),
          input,
          span_text('modal__count-label --right', 'units'),
        ]),
        calculator,
        div_nodes('modal__buttons', [
          cancel,
          confirm,
        ]),
      ]),
    ]),
  ]);

  const store = new CalculatorStore();
  store.updates.subscribers.add((store) => {
    const { digits, positive } = store;
    input.textContent = `${positive ? '' : '-'}${digits}`;
    operator.textContent = positive ? '-' : '+';
    const valid = count + store.getValue() < min;
    confirm.toggleAttribute('disabled', valid);
  });

  calculator.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const digit = target.dataset.digit;
    assertRequiredString(digit, "required-dataset-digit");
    store.append(digit);
    store.update();
  });

  operator.addEventListener('click', (event) => {
    store.positive = !store.positive;
    store.update();
    event.stopPropagation();
  });

  clear.addEventListener('click', (event) => {
    store.positive = true;
    store.digits = "0";
    store.update();
    event.stopPropagation();
  });

  const { promise, resolve } = Promise.withResolvers<SupplyModalResponse>();

  cancel.addEventListener('click', (event) => {
    event.stopPropagation();
    resolve({ type: 'cancel' });
  });

  confirm.addEventListener('click', (event) => {
    event.stopPropagation();
    resolve({
      type: 'confirm',
      value: store.getValue(),
      resource: options,
    });
  });

  return { promise, root, store };
}
