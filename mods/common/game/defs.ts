export const gameCreatePathname = "/games/create";
export const gameReadPathname = "/games/join";
export const gameQuitPathname = "/games/quit";
export const gameSocketPatternPathname = "/games/socket/:token";
export const createGameSocketPathname = (token: string) => `/games/socket/${token}`;
