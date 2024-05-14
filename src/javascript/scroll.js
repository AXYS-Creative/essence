import { maxXxl, maxXl, maxLg, maxMd } from "./utility.js";
import { navMenu } from "./nav.js";

const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper"),
  footerNavLinks = document.querySelector(".footer-nav-links"),
  footerCtaTitle = document.querySelector(".footer-cta-title");

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
  const scrollHeight = document.body.scrollHeight;
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

  // CTA position in the hero/page
  const rootElem = document.documentElement; // for css vars

  let ctaHeroPosition;
  if (maxMd.matches) {
  } else if (maxLg.matches) {
    ctaHeroPosition = 424;
  } else if (maxXl.matches) {
    ctaHeroPosition = 296;
  } else if (maxXxl.matches) {
    ctaHeroPosition = 548;
  } else {
    ctaHeroPosition = 640;
  }

  // Update CTA animation based on scroll position
  if (scrollPosition >= scrollFromTop) {
    ctaWrapper.classList.add("scroll-active");
    ctaWrapper.style.animationName = "cta-animated-top";
  } else {
    ctaWrapper.classList.remove("scroll-active");
    ctaWrapper.style.animationName = "cta-default";
  }

  // Adjust header/cta at bottom of page
  const footerLinksDistance = Math.ceil(
    scrollHeight -
      (footerNavLinks.getBoundingClientRect().bottom + scrollPosition)
  );
  const footerCtaTitleDistance = Math.ceil(
    scrollHeight -
      (footerCtaTitle.getBoundingClientRect().bottom + scrollPosition)
  );

  rootElem.style.setProperty(
    "--bottom-distance-social-media",
    `${footerLinksDistance}px`
  );
  rootElem.style.setProperty(
    "--bottom-distance-footer-cta-title",
    `${footerCtaTitleDistance}px`
  );

  const handleScrollBottom = (threshold, threshold2) => {
    // header/social logic
    if (scrollHeight - (scrollPosition + clientHeight) < threshold) {
      siteHeader.classList.add("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "-1");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "0");
    }

    // cta logic
    if (scrollHeight - (scrollPosition + clientHeight) < threshold2) {
      ctaWrapper.classList.add("scroll-bottom");
    } else {
      ctaWrapper.classList.remove("scroll-bottom");
    }
  };

  let bodyPadding = parseInt(
    getComputedStyle(rootElem).getPropertyValue("--body-padding"),
    10
  );

  handleScrollBottom(
    footerLinksDistance - bodyPadding - 4, // Maintain 4px in _globals.scss as well
    footerCtaTitleDistance - bodyPadding - 56 // Maintain 56px in _globals.scss as well
  );

  // Animate CTA from the top
  ctaStylesheet.innerHTML = `

  @keyframes cta-default {
    from {
      top: calc(${scrollPosition + clientHeight}px - 64px * 1.6);
    }
    to {
      top: ${ctaHeroPosition}px;
    }
  }

  @keyframes cta-animated-top {
    from {
      top: calc(${ctaHeroPosition}px - ${scrollFromTop}px);
    }
    to {
      top: calc(100vh - 64px * 1.6);
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
