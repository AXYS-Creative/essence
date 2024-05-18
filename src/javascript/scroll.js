import { maxXxl, maxXl, maxLg, maxMd } from "./utility.js";

export let scrollPosition = 0;
export let scrollFromTop;

let ctaHeroPosition;

export const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper");

const heroSubText = document.querySelector(".hero-section__subtext"),
  footerNavLinks = document.querySelector(".footer-nav-links"),
  footerCtaTitle = document.querySelector(".footer-cta-title");

const headerLinks = document.querySelectorAll(".header-links__link");

const rootElem = document.documentElement; // For CSS variables

let bodyPadding = parseInt(
  getComputedStyle(rootElem).getPropertyValue("--body-padding"),
  10
);

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

  if (scrollPosition >= scrollFromTop) {
    siteHeader.classList.add("scroll-active");
    menuBtn.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("tabindex", "0");
    headerLinks.forEach((link) => link.setAttribute("tabindex", "-1"));
    ctaWrapper.classList.add("scroll-active");
    ctaWrapper.style.animationName = "cta-animated-top";
  } else {
    siteHeader.classList.remove("scroll-active");
    headerLinks.forEach((link) => link.removeAttribute("tabindex"));
    menuBtn.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("tabindex", "-1");
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
    } else if (
      scrollHeight - (scrollPosition + clientHeight) < threshold &&
      scrollPosition > scrollFromTop
    ) {
      siteHeader.classList.remove("header-scroll-bottom");
      menuBtn.setAttribute("tabindex", "0");
    } else {
      siteHeader.classList.remove("header-scroll-bottom");
    }

    // cta logic
    if (scrollHeight - (scrollPosition + clientHeight) < threshold2) {
      ctaWrapper.classList.add("scroll-bottom");
    } else {
      ctaWrapper.classList.remove("scroll-bottom");
    }
  };

  handleScrollBottom(
    footerLinksDistance - bodyPadding - 4, // Maintain 4px in _globals.scss as well - search banana
    footerCtaTitleDistance - bodyPadding - 56 // Maintain 56px in _globals.scss as well
  );

  // CTA position in the hero/page
  if (heroSubText) {
    ctaHeroPosition =
      heroSubText.getBoundingClientRect().bottom + scrollPosition + 48;
  } else {
    ctaHeroPosition = clientHeight - bodyPadding;
  }

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
      top: calc(100dvh - 64px * 1.6);
    }
  }
  
  @media (max-width: 768px) {
    @keyframes cta-animated-top {
      from {
        top: calc(${ctaHeroPosition}px - ${scrollFromTop}px);
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
        top: calc(${ctaHeroPosition}px - ${scrollFromTop}px);
      }
      to {
        top: calc(100vh - 72px);
        top: calc(100dvh - 72px);
      }
    }
  }
  
  `;
};

// CTA Reposition
// let ctaScrollTrigger = 480; // Distance from the top (in px) needed to scroll to reposition the CTA
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
