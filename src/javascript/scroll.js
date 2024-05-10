import { maxXxl, maxXl, maxLg, maxMd } from "./utility.js";

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

const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper");

const headerLinks = document.querySelectorAll(".header-links__link");

// Header Defaults
menuBtn.setAttribute("tabindex", "-1");

//
// All Scroll Animations that require SCRUBBING
//

const checkScroll = () => {
  const scrollPosition = window.scrollY;

  // Detect if the user has scrolled away from the top of the page
  if (scrollPosition >= 24) {
    siteHeader.classList.add("scroll-active");
    // ctaWrapper.classList.add("scroll-active");

    menuBtn.setAttribute("aria-hidden", "false");
    menuBtn.removeAttribute("tabindex");

    headerLinks.forEach((link) => link.setAttribute("tabindex", -1));
  } else {
    siteHeader.classList.remove("scroll-active");
    // ctaWrapper.classList.remove("scroll-active");

    headerLinks.forEach((link) => link.removeAttribute("tabindex"));

    menuBtn.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("tabindex", "-1");
  }

  if (scrollPosition >= 400) {
    ctaWrapper.classList.add("scroll-active");
  } else {
    ctaWrapper.classList.remove("scroll-active");
  }

  // Detect if the user is near the bottom of the page
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const handleScrollBottom = (threshold) => {
    if (scrollHeight - (scrollPosition + clientHeight) < threshold) {
      siteHeader.classList.add("header-scroll-bottom");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
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
};

window.addEventListener("scroll", throttle(checkScroll, 50)); // Throttle checkScroll, adjust 100ms as needed
