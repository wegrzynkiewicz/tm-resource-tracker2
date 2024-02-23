import { ServiceResolver } from "../../../common/dependency.ts";
import { div_text } from "../../../common/frontend-framework/dom.ts";
import { IntroAppView, provideIntroAppView } from "../intro/intro-app.ts";

export class LoadingView {
  public readonly $root = div_text("loading", "Loading...");

  public constructor(
    private readonly app: IntroAppView,
  ) {
  }

  public render() {
    this.app.render(this.$root);
  }
}

export function provideLoadingView(resolver: ServiceResolver) {
  return new LoadingView(
    resolver.resolve(provideIntroAppView),
  );
}
