import { input_props, div_nodes, label_props } from "../../frontend-framework/dom.ts";

export function createEditBox(
  { label, name, placeholder }: {
    label: string,
    name: string,
    placeholder?: string
  }
) {
  const $input = input_props({
    autocomplete: "off",
    className: 'edit-box_input',
    name,
    type: 'text',
    placeholder: placeholder ?? '',
  });
  const $root = div_nodes('edit-box _input', [
    label_props({
      className: 'edit-box_label',
      for: name,
      textContent: label,
    }),
    $input,
  ]);
  return { $root, $input }
}
