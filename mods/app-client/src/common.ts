type WithQuerySelector = {
  querySelector: Element["querySelector"];
  querySelectorAll: Element["querySelectorAll"];
};

export function querySelectorAll(parent: WithQuerySelector, query: string): NodeListOf<HTMLElement> {
  return parent.querySelectorAll(query) as NodeListOf<HTMLElement>;
}

const regex = /{(\w+?)}/g;

export function bindVariables(template: string, data: Record<string, unknown>) {
  return template.replace(regex, (_, token) => (data[token] || "") as string);
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
  options?: boolean | AddEventListenerOptions,
): void {
  const callback = function (this: HTMLElement, event: GlobalEventHandlersEventMap[TEvent]) {
    listener.call(this, event);
    event.preventDefault();
  };
  element.addEventListener(type, callback, options);
}

export interface Component {
  $root: HTMLElement;
}

export interface View extends Component {
  $root: HTMLElement;
  render(): void;
}
