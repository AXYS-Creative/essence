import { maxXxl, maxXl, maxLg, maxMd } from "./utility.js";
import { navMenu } from "./nav.js";

const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper"),
  footerNavLinks = document.querySelector(".footer-nav-links");

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

  let ctaPosition;
  if (maxMd.matches) {
    rootElem.style.setProperty("--body-padding", `24px`);
  } else if (maxLg.matches) {
    ctaPosition = 424;
  } else if (maxXl.matches) {
    ctaPosition = 296;
  } else if (maxXxl.matches) {
    ctaPosition = 548;
    rootElem.style.setProperty("--cta-position", `${ctaPosition}px`);
    rootElem.style.setProperty("--body-padding", `40px`);
  } else {
    ctaPosition = 640;

    rootElem.style.setProperty("--body-padding", `64px`);
  }

  // Update CTA animation based on scroll position
  if (scrollPosition >= scrollFromTop) {
    ctaWrapper.classList.add("scroll-active");
    ctaWrapper.style.animationName = "cta-animated";
  } else {
    ctaWrapper.classList.remove("scroll-active");
    ctaWrapper.style.animationName = "cta-default";
  }

  // Adjust header/cta at bottom of page
  const footerLinksDistance =
    scrollHeight -
    (footerNavLinks.getBoundingClientRect().bottom + scrollPosition);

  const handleScrollBottom = (threshold, ctaOffset) => {
    // header/social logic
    if (scrollHeight - (scrollPosition + clientHeight) < threshold) {
      siteHeader.classList.add("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "-1");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "0");
    }

    // cta logic
    if (
      scrollHeight - (scrollPosition + clientHeight) <
      threshold - ctaOffset
    ) {
      ctaWrapper.classList.add("scroll-bottom");
    } else {
      ctaWrapper.classList.remove("scroll-bottom");
    }
  };

  let bodyPadding = parseInt(
    getComputedStyle(rootElem).getPropertyValue("--body-padding"),
    10
  );

  // This will replace manually having to enter the distance from the bottom.
  // Now I just need to to it again for the cta (replace -96)
  handleScrollBottom(footerLinksDistance - bodyPadding, -96);

  // if (maxLg.matches) {
  //   handleScrollBottom(424, -96);
  // } else if (maxXl.matches) {
  //   handleScrollBottom(296, -96);
  // } else if (maxXxl.matches) {
  //   handleScrollBottom(280, -96);
  // } else {
  //   handleScrollBottom(480, -96);
  // }

  ctaStylesheet.innerHTML = `

  @keyframes cta-default {
    from {
      top: calc(${scrollPosition + clientHeight}px - 64px * 1.6);
    }
    to {
      top: ${ctaPosition}px;
    }
  }

  @keyframes cta-animated {
    from {
      top: calc(${ctaPosition}px - ${scrollFromTop}px);
    }
    to {
      top: calc(100vh - 64px * 1.6);
    }
  }

  /* Maybe just add a class that uses !important to override the styles? */

  @keyframes cta-bottom {
    from {
      top: calc(100vh - 64px * 1.6);
    }
    to {
      position: absolute;
      top: auto;
      /* bottom: 640px; */
      bottom: 532px;
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
