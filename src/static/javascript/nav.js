import { maxSm, minMd, maxLg } from "./utility.js";
import { navCursor, navElements } from "./core/mouseCursor.js";
import { lenis } from "./core/lenis.js";
import {
  scrollPosition,
  scrollFromTop,
  throttle,
  updateScrollDependentElements,
  ctaWrapper,
} from "./scroll.js";

export let isNavOpen;

export const navMenu = document.querySelector(".nav-menu"),
  menuBtn = document.querySelector(".menu-btn"),
  siteHeader = document.querySelector(".site-header"),
  headerLogo = document.querySelector(".header-logo"),
  navLinksWrapper = document.querySelector(".nav-links");

const navLinks = document.querySelectorAll(".nav-link"),
  navMenuBackdrop = document.querySelectorAll(".nav-menu .backdrop"),
  tabElementsPage = document.querySelectorAll(".tab-element-page"),
  tabElementsNav = document.querySelectorAll(".tab-element-nav");

tabElementsNav.forEach((elem) => elem.setAttribute("tabIndex", "-1"));

const toggleNav = () => {
  navMenu.classList.toggle("menu-active");
  menuBtn.classList.toggle("menu-active");
  siteHeader.classList.toggle("menu-active");

  isNavOpen = navMenu.classList.contains("menu-active");

  navMenu.setAttribute("aria-hidden", !isNavOpen);
  menuBtn.setAttribute("aria-expanded", isNavOpen);

  //   Update tabindex for tabElementsPage and tabElementsNav
  tabElementsPage.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "-1" : "0")
  );
  tabElementsNav.forEach((el) =>
    el.setAttribute("tabindex", isNavOpen ? "0" : "-1")
  );

  //
  // Reposition CTA based on menu toggle (MD screen and below)
  //
  if (maxLg.matches) {
    if (isNavOpen) {
      ctaWrapper.classList.add("scroll-active");
      ctaWrapper.style.animationName = "cta-animated-top";
    } else if (scrollPosition < scrollFromTop) {
      ctaWrapper.classList.remove("scroll-active");
      ctaWrapper.style.animationName = "cta-default";
    } else {
      // Keep the scroll-active class if user has scrolled down
      ctaWrapper.classList.add("scroll-active");
      ctaWrapper.style.animationName = "cta-animated-top";
    }
  }

  // document.body.style = `overflow: ${isNavOpen ? "hidden" : "auto"}`;
  if (isNavOpen) {
    lenis.stop();
  } else {
    lenis.start();
  }
};

headerLogo.addEventListener("focus", () => {
  if (!isNavOpen) {
    window.scrollTo(0, 0);
  }
});

export const closeNav = () => {
  // document.body.style = "overflow: auto;";
  lenis.start();

  navMenu.classList.remove("menu-active");
  menuBtn.classList.remove("menu-active");
  siteHeader.classList.remove("menu-active");
  navCursor.classList.remove("active");

  navMenu.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");

  // Reset tabindex for tabElementsPage and tabElementsNav
  tabElementsPage.forEach((el) => el.setAttribute("tabindex", "0"));
  tabElementsNav.forEach((el) => el.setAttribute("tabindex", "-1"));
};

// // Prevent certain navlinks from closing the nav (may not be needed)
// navLinks.forEach((link) => {
//   // prevent-nav-close is used for links that take the user to a new page.
//   if (!link.classList.contains("prevent-nav-close")) {
//     link.addEventListener("click", closeNav);
//   }
// });

menuBtn.addEventListener("click", toggleNav);

navMenuBackdrop.forEach((el) =>
  el.addEventListener("click", (e) => {
    if (
      navElements.some((className) => e.target.classList.contains(className))
    ) {
      closeNav();
    }
  })
);

// headerLogo.addEventListener("click", closeNav);

//
// Nav LinksWrapper based on mouse vertical mouse movement (responsive & accessible)
//

// Keyboard accessible nav-links. Reposition on focus
const keyboardAccessibleNavLinks = (
  percentage,
  multiplier,
  leftPadding = 0
) => {
  const focusHandler = (index) => {
    const translationValue = calculateTranslation(index);
    navLinksWrapper.style.translate = `${leftPadding}px calc(${percentage}% - ${translationValue}px)`;
  };

  const blurHandler = () => {
    navLinksWrapper.style.translate = "0 0";
  };

  const calculateTranslation = (index) => {
    return index * multiplier;
  };

  navLinks.forEach((link, index) => {
    link.addEventListener("focus", () => focusHandler(index));
    link.addEventListener("blur", blurHandler);
  });
};

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
      navLinksWrapper.addEventListener("mousemove", handleNavLinksWrapper);
    } else {
      navLinksWrapper.style.translate = `24px 0`; // body-padding-md
      navLinksWrapper.removeEventListener("mousemove", handleNavLinksWrapper);

      keyboardAccessibleNavLinks(0, 0, 24);
    }
  };

  const querySmHandler = (e) => {
    if (e.matches) {
      navLinksWrapper.style.translate = `16px 0`;
      keyboardAccessibleNavLinks(0, 0, 16);
    }
  };

  const queryLgHandler = (e) => {
    if (e.matches) {
      minOffset = 0.3;
      maxOffset = 0.75;
      customOffset = -32; // in px

      keyboardAccessibleNavLinks(15, 50); // arg1: percentage offset,  arg2; how dramatic the slide is
    } else {
      minOffset = 0.2;
      maxOffset = 0.8;
      customOffset = 0;

      keyboardAccessibleNavLinks(10, 75);
    }
    updateYBounds();
  };

  //
  // To handle responsive javascript
  //

  maxLg.addEventListener("change", queryLgHandler);
  queryLgHandler(maxLg);

  minMd.addEventListener("change", queryMdHandler);
  queryMdHandler(minMd);

  maxSm.addEventListener("change", querySmHandler);
  querySmHandler(maxSm);
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

//
// Nav Image Hover/Focus
//

const navImgs = document.querySelectorAll(".nav-img");

navLinks.forEach((link, index) => {
  const addActiveClass = () => navImgs[index].classList.add("active");
  const removeActiveClass = () => navImgs[index].classList.remove("active");

  link.addEventListener("mouseenter", addActiveClass);
  link.addEventListener("mouseleave", removeActiveClass);
  link.addEventListener("focus", addActiveClass);
  link.addEventListener("blur", removeActiveClass);
});
