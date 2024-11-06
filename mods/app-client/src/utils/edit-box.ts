import { div_nodes, input, label } from "@framework/dom/nodes.ts";

export function createEditBox(
  { caption, name, placeholder }: {
    caption: string;
    name: string;
    placeholder?: string;
  },
) {
  const $input = input("edit-box_input");
  $input.autocomplete = "off";
  $input.id = name;
  $input.name = name;
  $input.type = "text";
  $input.placeholder = placeholder ?? "";

  const $label = label("edit-box_label", caption);
  $label.htmlFor = name;

  const $root = div_nodes("edit-box _input", [
    $label,
    $input,
  ]);
  return { $root, $input };
}
