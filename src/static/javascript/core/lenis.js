// import { isNavOpen } from "../nav.js";

// const menuBtn = document.querySelector(".menu-btn");

export const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// // Prevent scroll when nav is open
// // let menuOpen = false;
// menuBtn.addEventListener("click", () => {
//   console.log(isNavOpen);
//   // menuOpen = !menuOpen;

//   if (isNavOpen) {
//     lenis.stop();
//   } else {
//     lenis.start();
//   }
// });
