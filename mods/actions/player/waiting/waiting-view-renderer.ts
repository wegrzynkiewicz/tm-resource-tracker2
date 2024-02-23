import { provideAppView } from "../../../apps/client/features/app/app.ts";
import { provideTitle } from "../../../apps/client/features/config.ts";
import { ServiceResolver } from "../../../common/dependency.ts";
import { provideWaitingView } from "./waiting-view.ts";

export interface WaitingViewRenderer {
  render(): void;
}

export function provideWaitingViewRenderer(resolver: ServiceResolver): WaitingViewRenderer {
  const app = resolver.resolve(provideAppView);
  const title = resolver.resolve(provideTitle);
  const waiting = resolver.resolve(provideWaitingView);
  const render = () => {
    app.top.setLabel(title);
    app.mount(waiting.$root);
    app.hideToolbar();
  }
  return { render };
}
