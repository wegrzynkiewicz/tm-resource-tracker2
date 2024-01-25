import { assertNonNull } from "./asserts.ts";

type WithQuerySelector = {
  querySelector: Element['querySelector'];
  querySelectorAll: Element['querySelectorAll'];
}

export function getElementById<T extends HTMLElement>(id: string,): T {
  const node = document.getElementById(id);
  assertNonNull(node, '');
  return node as T;
}

export function querySelector<T extends HTMLElement>(parent: WithQuerySelector, query: string): T {
  const node = parent.querySelector(query);
  assertNonNull(node, '');
  return node as T;
}

export function querySelectorAll(parent: WithQuerySelector, query: string): NodeListOf<HTMLElement> {
  return parent.querySelectorAll(query) as NodeListOf<HTMLElement>;
}

export function cloneTemplate(templateId: string) {
  const template = getElementById<HTMLTemplateElement>(templateId);
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  return fragment;
}

const regex = /{(\w+?)}/g;

export function bindVariables(template: string, data: Record<string, unknown>) {
  return template.replace(regex, (_, token) => (data[token] || '') as string);
}

export function bindTemplate(templateId: string, data: Record<string, unknown>): string {
  const template = getElementById<HTMLTemplateElement>(templateId);
  const renderedTemplate = bindVariables(template.innerHTML, data);
  return renderedTemplate;
}

export function ref(element: WithQuerySelector, name: string): HTMLElement {
  const node = querySelector(element, `[data-ref="${name}"]`);
  assertNonNull(node, '');
  return node;
}

export interface Refs {
  [key: string]: HTMLElement;
}

export function refs<T extends Refs = Refs>(element: WithQuerySelector): Refs {
  const nodes = querySelectorAll(element, `[data-ref]`);
  const refs: Refs = {};
  for (const node of nodes) {
    const name = node.dataset.ref;
    if (name) {
      refs[name] = node;
    }
  }
  return refs;
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

export function tag<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classes: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = classes;
  return node;
}
