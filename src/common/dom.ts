export type Properties = { [key: string]: unknown };

export function createElement<TTag extends keyof HTMLElementTagNameMap>(
  tag: TTag,
  className = '',
): HTMLElementTagNameMap[TTag] {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

export function appendChildren(node: Node, children: Node[]) {
  const length = children.length;
  for (let i = 0; i < length; i++) {
    node.appendChild(children[i]);
  }
}

function createTagEmpty<TTag extends keyof HTMLElementTagNameMap>(tag: TTag) {
  return (className: string) => createElement(tag, className);
}

function createTagText<TTag extends keyof HTMLElementTagNameMap>(tag: TTag) {
  return (className: string, textContent: string) => {
    const node = createElement(tag, className);
    node.textContent = textContent;
    return node;
  }
}

function createTagNodes<TTag extends keyof HTMLElementTagNameMap>(tag: TTag) {
  return (className: string, children: Node[]) => {
    const node = createElement(tag, className);
    appendChildren(node, children);
    return node;
  }
}

function createTagProps<TTag extends keyof HTMLElementTagNameMap>(tag: TTag) {
  return (props: Properties) => {
    const node = createElement(tag);
    Object.assign(node, props);
    return node;
  }
}

function createTagAdvanced<TTag extends keyof HTMLElementTagNameMap>(tag: TTag) {
  return (props: Properties, children: Node[]) => {
    const node = createElement(tag);
    Object.assign(node, props);
    appendChildren(node, children);
    return node;
  }
}

export function fragment() {
  return document.createDocumentFragment();
}

export function fragment_nodes(children: Node[]) {
  const node = fragment();
  appendChildren(node, children);
  return node;
}

export const button_nodes = createTagNodes('button');
export const button_text = createTagText('button');

export const div_empty = createTagEmpty('div');
export const div_text = createTagText('div');
export const div_nodes = createTagNodes('div');
export const div_props = createTagProps('div');
export const div = createTagAdvanced('div');

export const form = createTagAdvanced('form');
export const fieldset = createTagNodes('fieldset');
export const input_props = createTagProps('input');
export const label_props = createTagProps('label');
export const legend_text = createTagText('legend');

export const img_props = createTagProps('img');

export const span_empty = createTagEmpty('span');
export const span_props = createTagProps('span');
export const span_text = createTagText('span');


