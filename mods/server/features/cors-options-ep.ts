import { EPHandler, EPRoute } from "../web/endpoint.ts";

export const corsOptionsEPRoute = new EPRoute("OPTIONS", "/*");

export class CorsOptionsEP implements EPHandler {
  public async handle(): Promise<Response> {
    const response = new Response(null, { status: 200 });
    response.headers.set("Access-Control-Allow-Corss", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    return response;
  }
}

export function provideCorsOptionsEPHandler() {
  return new CorsOptionsEP();
}
