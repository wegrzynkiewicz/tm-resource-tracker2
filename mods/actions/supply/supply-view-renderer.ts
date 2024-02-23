import { provideAppView } from "../../apps/client/features/app/app.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { provideSupplyPanelView } from "./supply-panel-view.ts";

export interface SupplyViewRenderer {
  render(): void;
}

export function provideSupplyViewRenderer(resolver: ServiceResolver): SupplyViewRenderer {
  const app = resolver.resolve(provideAppView);
  const supply = resolver.resolve(provideSupplyPanelView);
  const render = () => {
    app.top.setLabel('Supplies');
    app.mount(supply.$root);
    app.showToolbar();
  }
  return { render };
}
