import { minMd, maxLg } from "./utility.js";
import {
  scrollPosition,
  scrollFromTop,
  throttle,
  updateScrollDependentElements,
  ctaWrapper,
} from "./scroll.js";

export const navMenu = document.querySelector(".nav-menu"),
  menuBtn = document.querySelector(".menu-btn"),
  siteHeader = document.querySelector(".site-header"),
  headerLogo = document.querySelector(".header-logo"),
  navLinksWrapper = document.querySelector(".nav-links");

const navLinks = document.querySelectorAll(".nav-link"),
  tabElementsPage = document.querySelectorAll(".tab-element-page"),
  tabElementsNav = document.querySelectorAll(".tab-element-nav");

tabElementsNav.forEach((elem) => elem.setAttribute("tabIndex", "-1"));

const toggleNav = () => {
  navMenu.classList.toggle("menu-active");
  menuBtn.classList.toggle("menu-active");
  siteHeader.classList.toggle("menu-active");

  const isNavOpen = navMenu.classList.contains("menu-active");

  navMenu.setAttribute("aria-hidden", isNavOpen);
  menuBtn.setAttribute("aria-expanded", !isNavOpen);

  //   Update tabindex for tabElementsPage and tabElementsNav
  tabElementsPage.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "0" : "-1")
  );
  tabElementsNav.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "-1" : "0")
  );

  //
  // Reposition CTA based on menu toggle (MD screen and below)
  //
  if (!minMd.matches) {
    if (isNavOpen) {
      ctaWrapper.classList.add("scroll-active");
      ctaWrapper.style.animationName = "cta-animated-top";
    } else {
      if (scrollPosition < scrollFromTop) {
        ctaWrapper.classList.remove("scroll-active");
        ctaWrapper.style.animationName = "cta-default";
      }
    }
  }

  // // Pevent scroll when nav is open // Doesn't work with Lenis out of the box... see lenis.js
  // document.body.style = `overflow: ${!isNavOpen ? "hidden" : "auto"}`;
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
// Nav LinksWrapper based on mouse vertical mouse movement (responsive) INACCESSIBLE!
//

const handleNavGlide = () => {
  let minOffset = 0.2;
  let maxOffset = 0.8;
  let customOffset = 0;
  let minY, maxY;

  const updateYBounds = () => {
    minY = minOffset * window.innerHeight;
    maxY = maxOffset * window.innerHeight;
  };

  const handleNavLinksWrapper = (e) => {
    updateYBounds();
    const mouseY = Math.min(Math.max(e.clientY, minY), maxY);
    const translateY = (maxY + minY) / 2 - mouseY;
    navLinksWrapper.style.translate = `0% calc(${translateY}px + ${customOffset}px)`;
  };

  const queryMdHandler = (e) => {
    if (e.matches) {
      navLinksWrapper.style.translate = `0 0`;
      window.addEventListener("mousemove", handleNavLinksWrapper);
    } else {
      navLinksWrapper.style.translate = `24px 0`;
      window.removeEventListener("mousemove", handleNavLinksWrapper);
    }
  };

  const queryLgHandler = (e) => {
    if (e.matches) {
      minOffset = 0.3;
      maxOffset = 0.75;
      customOffset = -32; // in px
    } else {
      minOffset = 0.2;
      maxOffset = 0.8;
      customOffset = 0;
    }
    updateYBounds();
  };

  //
  // To handle responsive javascript
  //
  minMd.addEventListener("change", queryMdHandler);
  queryMdHandler(minMd);

  maxLg.addEventListener("change", queryLgHandler);
  queryLgHandler(maxLg);
};

handleNavGlide();

//
// Scroll logic for cta... basically it's returning when closing the menu on smaller devices
//

// Event listener for scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    const scrollPosition = window.scrollY;
    updateScrollDependentElements(scrollPosition);
  }, 50)
);
