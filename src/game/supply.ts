import { mapToFragment } from "../common.ts";
import { fragment_nodes, div_text, img_props, div_nodes, div_empty } from "../common/dom.ts";

export interface Supply {
  name: string;
}

const supplies: Supply[] = [
  { name: "points" },
  { name: "gold" },
  { name: "steel" },
  { name: "titan" },
  { name: "plant" },
  { name: "energy" },
  { name: "heat" },
];

function createSupply({ name }: Supply) {
  return fragment_nodes([
    div_nodes(`supply --production --${name}`, [
      div_text('box --counter', "0"),
    ]),
    div_nodes(`supply --icon --${name}`, [
      img_props({
        className: 'supply__icon',
        width: "64",
        height: "64",
        alt: "supply-icon",
        src: `/images/supplies/${name}.svg`,
      }),
    ]),
    div_nodes(`supply --amount --${name}`, [
      div_text('box --counter', "0"),
    ]),
  ]);
}

export function createSupplies() {
  return div_nodes("panel__item", [
    div_nodes("supplies", [
      div_empty("supplies__production"),
      div_text("supplies__round", "0"),
      mapToFragment(supplies, createSupply),
    ]),
  ]);
}

export function createSuppliesPanel() {
  return div_nodes("panel", [
    mapToFragment([1, 2, 3, 4], createSupplies),
  ]);
}
