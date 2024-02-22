import { div_nodes, input_props, label_props } from "../../../common/frontend-framework/dom.ts";

export function createEditBox(
  { label, name, placeholder }: {
    label: string;
    name: string;
    placeholder?: string;
  },
) {
  const $input = input_props({
    autocomplete: "off",
    className: "edit-box_input",
    id: name,
    name,
    type: "text",
    placeholder: placeholder ?? "",
  });
  const $root = div_nodes("edit-box _input", [
    label_props({
      className: "edit-box_label",
      textContent: label,
    }, {
      for: name,
    }),
    $input,
  ]);
  return { $root, $input };
}
