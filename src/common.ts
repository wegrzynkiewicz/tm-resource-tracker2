import { assertNonNull } from "./asserts.ts";

export function getElementById<T extends HTMLElement>(id: string,): T {
  const node = document.getElementById(id);
  assertNonNull(node, '');
  return node as T;
}

export function cloneTemplate(templateId: string) {
  const template = getElementById<HTMLTemplateElement>(templateId);
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  return fragment;
}

type WithQuerySelector = {
  querySelector: Element['querySelector'];
  querySelectorAll: Element['querySelectorAll'];
}

export function ref(element: WithQuerySelector, name: string): HTMLElement {
  return querySelector(element, `[data-ref="${name}"]`);
}

export function querySelector<T extends HTMLElement>(parent: WithQuerySelector, query: string): T {
  const node = parent.querySelector(query);
  assertNonNull(node, '');
  return node as T;
}

export function listener<TEvent extends keyof GlobalEventHandlersEventMap>(
  element: HTMLElement,
  type: TEvent,
  listener: (this: HTMLElement, event: GlobalEventHandlersEventMap[TEvent]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  const callback = function (this: HTMLElement, event: GlobalEventHandlersEventMap[TEvent]) {
    listener.call(this, event);
    event.preventDefault();
  }
  element.addEventListener(type, callback, options);
}
