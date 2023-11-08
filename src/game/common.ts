import { assertHTMLElement } from "./asserts";

export function cloneTemplate(templateId: string) {
  const template = document.getElementById(templateId);
  assertHTMLElement(template, 'template', 'cannot-get-template-tag-by-id', { template, templateId });
  const root = template.content.cloneNode(true) as DocumentFragment;
  const nodes = root.querySelectorAll('[data-tid]') as NodeListOf<HTMLElement>;
  const entries = [...nodes.values()].map(node => [node.dataset.tid, node]);
  const refs = Object.fromEntries(entries) as Record<string, HTMLElement>;
  return {
    refs,
    root,
  };
}
