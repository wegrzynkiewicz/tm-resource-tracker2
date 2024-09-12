import { defineDependency } from "@acme/dependency/declaration.ts";
import { RequestMaker } from "./request-maker.ts";
import { apiURLDependency } from "./api-url-config.ts";
import { frontendScopeContract } from "../bootstrap.ts";
import { DependencyResolver } from "@acme/dependency/resolver.ts";

export function provideApiRequestMaker(resolver: DependencyResolver) {
  return new RequestMaker(
    resolver.resolve(apiURLDependency),
  );
}
export const apiRequestMakerDependency = defineDependency({
  name: "api-request-maker",
  provider: provideApiRequestMaker,
  scope: frontendScopeContract,
});
