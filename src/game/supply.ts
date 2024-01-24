import { mapToFragment } from "../common.ts";
import { fragment_nodes, div_text, img_props, div_nodes, div_empty } from "../common/dom.ts";
import { ResourceDefinitionItem, resources } from "../data/resources.ts";

function createSupply({ type }: ResourceDefinitionItem) {
  const production = div_text('box --counter', "0");
  const amount = div_text('box --counter', "0");

  const root = fragment_nodes([
    div_nodes(`supply --production --${type}`, [
      production,
    ]),
    div_nodes(`supply --icon --${type}`, [
      img_props({
        className: 'supply__icon',
        width: "64",
        height: "64",
        alt: "supply-icon",
        src: `/images/supplies/${type}.svg`,
      }),
    ]),
    div_nodes(`supply --amount --${type}`, [
      amount,
    ]),
  ]);

  production.addEventListener('click', () => {
    console.log("production");
  });

  return root;
}

export function createSupplies() {
  return div_nodes("panel__item", [
    div_nodes("supplies", [
      div_empty("supplies__production"),
      div_text("supplies__round", "0"),
      mapToFragment(resources, createSupply),
    ]),
  ]);
}

export function createSuppliesPanel() {
  return div_nodes("panel", [
    mapToFragment([1, 2, 3, 4], createSupplies),
  ]);
}
