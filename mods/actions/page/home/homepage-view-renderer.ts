import { provideAppView } from "../../../apps/client/features/app/app.ts";
import { provideTitle } from "../../../apps/client/features/config.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideHomepageView } from "./homepage.ts";

export interface HomepageViewRenderer {
  render(): void;
}

export function provideHomepageViewRenderer(resolver: ServiceResolver): HomepageViewRenderer {
  const app = resolver.resolve(provideAppView);
  const title = resolver.resolve(provideTitle);
  const homepage = resolver.resolve(provideHomepageView);
  const render = () => {
    app.top.setLabel(title);
    app.mount(homepage.$root);
    app.hideToolbar();
  }
  return { render };
}
