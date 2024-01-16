import { mapToFragment } from "../common.ts";

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
  return (
    <>
      <div class={`box --counter supply --production --${name}`}>0</div>
      <img
        class={`supply --icon --${name}`}
        width="64"
        height="64"
        alt="supply-icon"
        src={`/images/supplies/${name}.svg`}
      />
      <div class={`box --counter supply --amount --${name}`}>0</div>
    </>
  );
}

export function createSupplies() {
  return (
    <div class="panel__item">
      <div class="supplies">
        <div class="supplies__production"></div>
        {mapToFragment(supplies, createSupply)}
      </div>
    </div>
  );
}

export function createSuppliesPanel() {
  return (
    <div className="panel">
      {mapToFragment([1, 2, 3, 4], createSupplies)}
    </div>
  );
}
