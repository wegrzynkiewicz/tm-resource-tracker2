import "./tsx-runtime.d.ts"

export const Fragment = Symbol("JSXFragment");

export type Attributes = Record<string, unknown>;

export interface Properties {
  children: unknown;
  [k: string]: unknown;
}

function processChildren(element: Node, value: unknown) {
  if (Array.isArray(value)) {
    for (const child of value) {
      processChildren(element, child);
    }
    return;
  }
  switch (typeof value) {
    case "object": {
      if (value === null) {
        return;
      }
      element.appendChild(value as any);
      return;
    }
    case "boolean":
    case "number":
    case "string": {
      const string = value.toString();
      const text = document.createTextNode(string);
      element.appendChild(text);
      return;
    }
    case "function": {
      const result = value(element);
      processChildren(element, result)
      return;
    }
    case "undefined":
    default: {
      return;
    }
  }
}

export function createFragment(children: unknown): DocumentFragment {
  const fragment = document.createDocumentFragment();
  processChildren(fragment, children);
  return fragment;
}

export function createElement(
  tag: string,
  attributes: Attributes,
  children: unknown
): HTMLElement {
  const element = document.createElement(tag);
  if (attributes !== null) {
    for (const [key, value] of Object.entries(attributes)) {
      switch (typeof value) {
        case "string": {
          if (key === 'className') {
            element.className = value;
            break;
          }
          element.setAttribute(key, value);
          break;
        }
        case "number": {
          element.setAttribute(key, value.toString());
          break;
        }
        case "boolean": {
          element.setAttribute(key, "");
          break;
        }
        case "function": {
          const listener = value as () => void;
          if (key.startsWith("on:")) {
            element.addEventListener(key.substring(3), listener);
          }
          (element as any)[key] = value;
          break;
        }
        default: {
          (element as any)[key] = value;
        }
      }
    }
  }
  processChildren(element, children);
  return element;
}

export function jsx(input: unknown, properties: Properties) {
  const { children, ...attributes } = properties;
  if (typeof input === "string") {
    return createElement(input, attributes, children);
  }
  if (typeof input === "function") {
    return input(properties);
  }
  if (input === Fragment) {
    return createFragment(children);
  }
}

export const jsxs = jsx;
