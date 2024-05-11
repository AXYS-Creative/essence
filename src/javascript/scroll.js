import { maxXxl, maxXl, maxLg, maxMd } from "./utility.js";
import { navMenu } from "./nav.js";

const siteHeader = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const ctaWrapper = document.querySelector(".cta-wrapper");

const headerLinks = document.querySelectorAll(".header-links__link");

// Header Defaults
menuBtn.setAttribute("tabindex", "-1");
const isNavOpen = navMenu.classList.contains("menu-active");

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const updateScrollDependentElements = (scrollPosition) => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  // Manage header scroll animations
  let scrollFromTop; // Distance from the top (in px) needed to scroll to reposition the CTA

  if (maxLg.matches) {
    scrollFromTop = 24;
  } else if (maxXl.matches) {
    scrollFromTop = 48;
  } else if (maxXxl.matches) {
    scrollFromTop = 64;
  } else {
    scrollFromTop = 96;
  }

  if (scrollPosition >= scrollFromTop) {
    siteHeader.classList.add("scroll-active");
    menuBtn.setAttribute("aria-hidden", "false");
    menuBtn.removeAttribute("tabindex");
    headerLinks.forEach((link) => link.setAttribute("tabindex", "-1"));
  } else {
    siteHeader.classList.remove("scroll-active");
    headerLinks.forEach((link) => link.removeAttribute("tabindex"));
    menuBtn.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("tabindex", "-1");
  }

  // Adjust header at bottom of page
  const handleScrollBottom = (threshold) => {
    if (scrollHeight - (scrollPosition + clientHeight) < threshold) {
      siteHeader.classList.add("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "-1");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "0");
    }
  };

  if (maxLg.matches) {
    handleScrollBottom(424);
  } else if (maxXl.matches) {
    handleScrollBottom(296);
  } else if (maxXxl.matches) {
    handleScrollBottom(340);
  } else {
    handleScrollBottom(480);
  }

  // CTA position in the hero/page
  const rootElem = document.documentElement;

  let ctaPosition;
  if (maxLg.matches) {
    ctaPosition = 424;
  } else if (maxXl.matches) {
    ctaPosition = 296;
  } else if (maxXxl.matches) {
    ctaPosition = 548;
    rootElem.style.setProperty("--cta-position", `${ctaPosition}px`);
  } else {
    ctaPosition = 640;
  }

  // Update CTA animation based on scroll position
  if (scrollPosition >= scrollFromTop) {
    ctaWrapper.classList.add("scroll-active");
    ctaWrapper.style.animationName = "cta-animated";
  } else {
    ctaWrapper.classList.remove("scroll-active");
    ctaWrapper.style.animationName = "cta-default";
  }

  ctaStylesheet.innerHTML = `
  @keyframes cta-animated {
    from {
      top: calc(${ctaPosition}px - ${scrollFromTop}px);
    }
    to {
      top: calc(100vh - 64px * 1.5);
    }
  }

  @keyframes cta-default {
    from {
      top: calc(${scrollPosition + clientHeight}px - 64px * 1.5);
    }
    to {
      top: ${ctaPosition}px;
    }
  }`;
};

// CTA Reposition
// let ctaScrollTrigger = 480; // Distance from the top (in px) needed to scroll to reposition the CTA
let ctaStylesheet = document.createElement("style");
document.head.appendChild(ctaStylesheet);

updateScrollDependentElements();
// Event listener for scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    const scrollPosition = window.scrollY;
    updateScrollDependentElements(scrollPosition);
  }, 50)
);
