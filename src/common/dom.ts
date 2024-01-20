function element(tag: string) {
  return document.createElement(tag);
}

function createTagEmpty(tag: string) {
  return (className: string) => {
    const node = element(tag);
    node.className = className;
    return node;
  }
}

function createTagText(tag: string) {
  return (className: string, textContent: string) => {
    const node = element(tag);
    node.className = className;
    node.textContent = textContent;
    return node;
  }
}

function createTagNodes(tag: string) {
  return (className: string, children: Node[]) => {
    const node = element(tag);
    node.className = className;
    for (let i = 0; i < children.length; i++) {
      node.appendChild(children[i]);
    }
    return node;
  }
}

function createTagProps(tag: string) {
  return (props: { [key: string]: string }) => {
    const node = element(tag);
    Object.assign(node, props);
    return node;
  }
}

export function fragment() {
  return document.createDocumentFragment();
}

export function fragment_nodes(children: Node[]) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < children.length; i++) {
    fragment.appendChild(children[i]);
  }
  return fragment;
}

export const button_nodes = createTagNodes('button');
export const button_text = createTagText('button');

export const div = createTagEmpty('div');
export const div_text = createTagText('div');
export const div_nodes = createTagNodes('div');

export const img_props = createTagProps('img');

export const span_props = createTagProps('span');
export const span_text = createTagText('span');
