import { minMd } from "./utility.js";

const navMenu = document.querySelector(".nav-menu"),
  menuBtn = document.querySelector(".menu-btn"),
  siteHeader = document.querySelector(".site-header"),
  headerLogo = document.querySelector(".header-logo"),
  navSlider = document.querySelector(".nav-slider");

const navLinks = document.querySelectorAll(".nav-link"),
  tabElementsPage = document.querySelectorAll(".tab-element-page"),
  tabElementsNav = document.querySelectorAll(".tab-element-nav");

tabElementsNav.forEach((elem) => elem.setAttribute("tabIndex", "-1"));

const toggleNav = () => {
  const isNavOpen = navMenu.classList.contains("menu-active");
  navMenu.classList.toggle("menu-active");
  menuBtn.classList.toggle("menu-active");
  siteHeader.classList.toggle("menu-active");

  navMenu.setAttribute("aria-hidden", isNavOpen);
  menuBtn.setAttribute("aria-expanded", !isNavOpen);

  //   Update tabindex for tabElementsPage and tabElementsNav
  tabElementsPage.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "0" : "-1")
  );
  tabElementsNav.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "-1" : "0")
  );

  // Pevent scroll when nav is open
  document.body.style = `overflow: ${!isNavOpen ? "hidden" : "auto"}`;
};

const closeNav = () => {
  // Pevent scroll when nav is open
  document.body.style = "overflow: auto;";

  navMenu.classList.remove("menu-active");
  menuBtn.classList.remove("menu-active");
  siteHeader.classList.remove("menu-active");

  navMenu.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");

  // Reset tabindex for tabElementsPage and tabElementsNav
  tabElementsPage.forEach((el) => el.setAttribute("tabindex", "0"));
  tabElementsNav.forEach((el) => el.setAttribute("tabindex", "-1"));
};

// This may not be needed since most links will take the user to a new page and refresh
navLinks.forEach((link) => {
  // prevent-nav-close is used for links that take the user to a new page.
  if (!link.classList.contains("prevent-nav-close")) {
    link.addEventListener("click", closeNav);
  }
});

menuBtn.addEventListener("click", toggleNav);

headerLogo.addEventListener("click", closeNav);

//
// Nav Slider (responsive)
//

// const minY = 360;
// const maxY = window.innerHeight - 150;
const minY = 0.2 * window.innerHeight; // 20% of the viewport height
const maxY = 0.8 * window.innerHeight;

const handleNavSlider = (e) => {
  // const mouseY = e.clientY;
  const mouseY = Math.min(Math.max(e.clientY, minY), maxY);
  const translateY = (maxY + minY) / 2 - mouseY;

  navSlider.style.translate = `0 calc(50vh + ${translateY}px)`;
};

// Restore Original Position
// navSlider.addEventListener("mouseleave", (e) => {
//   navSlider.style.translate = `0 50vh`;
// });

const handleScreenChange = (e) => {
  if (e.matches) {
    navSlider.addEventListener("mousemove", handleNavSlider);
  } else {
    navSlider.removeEventListener("mousemove", handleNavSlider);
    navSlider.style.translate = `unset`;
  }
};

//
// To handle responsive javascript
//
minMd.addEventListener("change", handleScreenChange);
handleScreenChange(minMd);
