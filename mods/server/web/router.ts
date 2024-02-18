import { Breaker } from "../../common/asserts.ts";
import { Logger } from "../../logger/global.ts";
import { EPContext } from "./endpoint.ts";
import { EPHandler, EPRoute } from "./endpoint.ts";
import { WebServerHandler } from "./server.ts";

export class URLNotMatchHandler implements WebServerHandler {
  public async handle(): Promise<Response> {
    const payload = {
      error: {
        message: "url-not-match",
      },
    };
    const response = Response.json(payload, { status: 404 });
    return response;
  }
}

export interface RouteBinding {
  handler: EPHandler;
  route: EPRoute;
}

export class Router implements WebServerHandler {
  private readonly bindings: RouteBinding[] = [];
  private readonly notMatchHandler = new URLNotMatchHandler();

  public constructor(
    private readonly logger: Logger,
  ) { }

  public add(route: EPRoute, handler: EPHandler): void {
    const binding: RouteBinding = { handler, route };
    this.bindings.push(binding);
  }

  public async handle(req: Request): Promise<Response> {
    for (const { handler, route } of this.bindings) {
      const { method, urlPattern } = route;
      if (req.method === method && urlPattern.test(req.url)) {
        const match = urlPattern.exec(req.url);
        if (match === null) {
          throw new Breaker("cannot-match-url-params", { req, urlPattern });
        }
        const context: EPContext = {
          params: { ...match.pathname.groups },
          request: req,
          url: new URL(req.url),
        };
        try {
          const response = await handler.handle(context);
          return response;
        } catch (error: unknown) {
          if (error instanceof Breaker) {
            const status = error.options.status ?? 500;
            const response = Response.json({ error: error.message }, { status });
            this.logger.debug('breaker-inside-router', { error });
            return response;
          }
          throw new Breaker("error-inside-router", {
            error,
            method,
            urlPattern: {
              pathname: urlPattern.pathname,
            },
          });
        }
      }
    }
    return this.notMatchHandler.handle();
  }
}
