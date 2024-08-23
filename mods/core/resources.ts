export type ResourceType = "points" | "gold" | "steel" | "titan" | "plant" | "energy" | "heat";
export type ResourceTarget = "production" | "amount";
export type ResourceTargets = Record<ResourceTarget, number>;
export type ResourceGroup = Record<ResourceType, ResourceTargets>;

export type ResourceProducer = (store: ResourceGroup, type: ResourceType) => void;

export interface Resource {
  count: number;
  target: ResourceTarget;
  type: ResourceType;
}

export interface ResourceDefinitionItem {
  type: ResourceType;
  targets: {
    production: {
      min: number;
      processor: ResourceProducer;
    };
    amount: {
      min: number;
    };
  };
}

export function createResourceDefinitionItem(
  { type, minAmount, minProd, processor }: {
    type: ResourceType;
    minAmount?: number;
    minProd?: number;
    processor?: ResourceProducer;
  },
) {
  return {
    type,
    targets: {
      production: {
        min: minProd ?? 0,
        processor: processor ?? processNormalProduction,
      },
      amount: {
        min: minAmount ?? 0,
      },
    },
  };
}

export function processNormalProduction(store: ResourceGroup, type: ResourceType) {
  store[type].amount += store[type].production;
}

export function processPointsProduction(store: ResourceGroup) {
  store.gold.amount += store.points.amount;
}

export function processEnergyProduction(store: ResourceGroup) {
  store.heat.amount += store.energy.amount;
  store.energy.amount = store.energy.production;
}

export const resources: ResourceDefinitionItem[] = [
  createResourceDefinitionItem({ type: "points", minAmount: 1, processor: processPointsProduction }),
  createResourceDefinitionItem({ type: "gold", minProd: -5 }),
  createResourceDefinitionItem({ type: "steel" }),
  createResourceDefinitionItem({ type: "titan" }),
  createResourceDefinitionItem({ type: "plant" }),
  createResourceDefinitionItem({ type: "energy", processor: processEnergyProduction }),
  createResourceDefinitionItem({ type: "heat" }),
];

export const resourcesByType: Record<ResourceType, ResourceDefinitionItem> = {
  points: resources[0],
  gold: resources[1],
  steel: resources[2],
  titan: resources[3],
  plant: resources[4],
  energy: resources[5],
  heat: resources[6],
};

export function createResourceTargets(amount = 0, production = 0): ResourceTargets {
  return { amount, production };
}

export function createResourceGroup(points: number): ResourceGroup {
  return {
    points: createResourceTargets(points),
    gold: createResourceTargets(),
    steel: createResourceTargets(),
    titan: createResourceTargets(),
    plant: createResourceTargets(),
    energy: createResourceTargets(),
    heat: createResourceTargets(),
  };
}
