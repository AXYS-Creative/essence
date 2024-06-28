import { maxXxl, maxXl, maxLg, maxMd, minMd, maxSm } from "./utility.js";

export let scrollPosition = 0;
export let scrollFromTop;

let ctaYPosition;

export const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper"),
  heroSubText = document.querySelector(".hero-section__subtext");

const footerNavLinks = document.querySelector(".footer-nav-links"),
  firstFooterNavLink = footerNavLinks.querySelector("li:first-of-type > a"),
  footerCtaTitle = document.querySelector(".footer-cta-title");

const headerLinks = document.querySelectorAll(".header-links__link");

const rootElem = document.documentElement; // For CSS variables

let bodyPadding = parseInt(
  getComputedStyle(rootElem).getPropertyValue("--body-padding"),
  10
);

firstFooterNavLink.addEventListener("focus", () => {
  window.scrollTo(0, document.body.scrollHeight);
});

export const throttle = (func, limit) => {
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

export const updateScrollDependentElements = (scrollPosition) => {
  const scrollHeight = document.body.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (maxLg.matches) {
    scrollFromTop = 24;
  } else if (maxXl.matches) {
    scrollFromTop = 48;
  } else if (maxXxl.matches) {
    scrollFromTop = 64;
  } else {
    scrollFromTop = 96;
  }

  const hasScrolled = scrollPosition >= scrollFromTop;

  siteHeader.classList.toggle("scroll-active", hasScrolled);

  // Add scroll-active (move cta to bottom) for certain pages. i.e. 'about'
  if (window.location.pathname.includes("about")) {
    // setTimeout(() => {
    siteHeader.classList.add("scroll-active", hasScrolled);
    // }, 400);
  }

  headerLinks.forEach((link) =>
    link.setAttribute("tabindex", hasScrolled ? "-1" : "0")
  );
  menuBtn.setAttribute("aria-hidden", String(!hasScrolled));
  menuBtn.setAttribute("tabindex", hasScrolled ? "0" : "-1");

  // Account for different pages, some pages don't have heroSubText
  if (heroSubText) {
    ctaWrapper.classList.toggle("scroll-active", hasScrolled);
    ctaWrapper.style.animationName = hasScrolled
      ? "cta-animated-top"
      : "cta-default";
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
    let atBottom = scrollHeight - (scrollPosition + clientHeight) < threshold;
    let closeToBottom =
      scrollHeight - (scrollPosition + clientHeight) < threshold2 &&
      scrollPosition > scrollFromTop;

    if (atBottom) {
      siteHeader.classList.add("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "-1");
    } else if (closeToBottom) {
      siteHeader.classList.remove("header-scroll-bottom");
      siteHeader.classList.add("header-hide-menu-btn");
      menuBtn.setAttribute("tabindex", "-1");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
      siteHeader.classList.remove("header-hide-menu-btn");
      menuBtn.setAttribute("tabindex", "0");
    }

    // CTA logic - scroll bottom
    if (scrollHeight - (scrollPosition + clientHeight) < threshold2) {
      ctaWrapper.classList.add("scroll-bottom");
    } else {
      ctaWrapper.classList.remove("scroll-bottom");
    }
  };

  if (maxSm.matches) {
    handleScrollBottom(
      footerLinksDistance - bodyPadding - 36,
      footerCtaTitleDistance - bodyPadding - 24
    );
  } else if (maxMd.matches) {
    handleScrollBottom(
      footerLinksDistance - bodyPadding - 16,
      footerCtaTitleDistance - bodyPadding - 20
    );
  } else {
    handleScrollBottom(
      footerLinksDistance - bodyPadding - 4, // Maintain 4px in _globals.scss as well - search banana
      footerCtaTitleDistance - bodyPadding - 56 // Maintain 56px in _globals.scss as well
    );
  }

  // CTA position based on different pages
  if (heroSubText) {
    // Tuck under hero subtext
    ctaYPosition =
      heroSubText.getBoundingClientRect().bottom + scrollPosition + 48;
  } else {
    // Move to bottom of screen
    ctaYPosition = clientHeight - bodyPadding;
    ctaWrapper.classList.add("scroll-active");
    ctaWrapper.style.animationName = "cta-animated-top";
  }

  // Animate CTA from the top
  ctaStylesheet.innerHTML = `

  @keyframes cta-default {
    from {
      top: calc(${scrollPosition + clientHeight}px - 64px * 1.6);
    }
    to {
      top: ${ctaYPosition}px;
    }
  }

  @keyframes cta-animated-top {
    from {
      top: calc(${ctaYPosition}px - ${scrollFromTop}px);
    }
    to {
      top: calc(100vh - 64px * 1.6);
      top: calc(100dvh - 64px * 1.6);
    }
  }
  
  @media (max-width: 768px) {
    @keyframes cta-animated-top {
      from {
        top: calc(${ctaYPosition}px - ${scrollFromTop}px);
      }
      to {
        top: calc(100vh - 56px);
        top: calc(100dvh - 56px);
      }
    }
  }

  @media (max-width: 480px) {
    @keyframes cta-animated-top {
      from {
        top: calc(${ctaYPosition}px - ${scrollFromTop}px);
      }
      to {
        top: calc(100vh - 72px);
        top: calc(100dvh - 72px);
      }
    }
  }
  
  `;
};

// CTA Reposition stylesheet
let ctaStylesheet = document.createElement("style");
document.head.appendChild(ctaStylesheet);

// Event listener for scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    scrollPosition = window.scrollY;
    updateScrollDependentElements(scrollPosition);
  }, 50)
);

updateScrollDependentElements(0);

menuBtn.setAttribute("tabindex", "-1");
