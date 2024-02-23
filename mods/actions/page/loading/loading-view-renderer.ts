import { provideAppView } from "../../../apps/client/features/app/app.ts";
import { provideTitle } from "../../../apps/client/features/config.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideLoadingView } from "./loading-view.ts";

export interface LoadingViewRenderer {
  render(): void;
}

export function provideLoadingViewRenderer(resolver: ServiceResolver): LoadingViewRenderer {
  const app = resolver.resolve(provideAppView);
  const title = resolver.resolve(provideTitle);
  const loading = resolver.resolve(provideLoadingView);
  const render = () => {
    app.top.setLabel(title);
    app.mount(loading.$root);
    app.hideToolbar();
  }
  return { render };
}
