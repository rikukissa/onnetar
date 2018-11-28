export const MOBILE_WIDTH = 500;
export const STANDALONE =
  (window.navigator as any).standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
export const IS_MOBILE = window.innerWidth < MOBILE_WIDTH;
