export const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/**
 * Cons of using Lenis
 * No smooth scrolling when tabbing through the page.
 * Lenis.pause() seems to removes ALL instances of scroll. (see small nav menu doesn't scroll / not just scoped to body)
 */
