import { Breaker } from "../../common/asserts.ts";

const BEARER = "Bearer ";

export function parseAuthorizationToken(request: Request): string {
  const auth = request.headers.get("authorization");
  if (auth === null) {
    throw new Breaker('unauthorized', { status: 401 });
  }
  if (auth.startsWith(BEARER) === false) {
    throw new Breaker('unauthorized', { status: 401 });
  }
  const token = auth.substring(BEARER.length);
  return token
}
