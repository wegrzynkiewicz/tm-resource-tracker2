export const gameCreatePathname = "/games/create";
export const gameJoinPathname = "/games/join";
export const gameQuitPathname = "/games/quit";
export const gameSocketPatternPathname = "/games/socket/:token";
export const createGameSocketPathname = (token: string) => `/games/socket/${token}`;
