const menuBtn = document.querySelector(".menu-btn");

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

let menuOpen = false;
menuBtn.addEventListener("click", () => {
  menuOpen = !menuOpen;

  if (menuOpen) {
    lenis.stop();
  } else {
    lenis.start();
  }
});
