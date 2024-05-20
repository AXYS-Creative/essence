import { maxXxl, maxXl, maxLg, minMd } from "./utility.js";

export let scrollPosition = 0;
export let scrollFromTop;

let ctaHeroPosition;

export const siteHeader = document.querySelector(".site-header"),
  menuBtn = document.querySelector(".menu-btn"),
  ctaWrapper = document.querySelector(".cta-wrapper");

const heroSubText = document.querySelector(".hero-section__subtext"),
  siteFooter = document.querySelector(".site-footer"),
  footerNavLinks = document.querySelector(".footer-nav-links"),
  firstFooterNavLink = footerNavLinks.querySelector("li:first-of-type > a"),
  headerLogo = document.querySelector(".header-logo"),
  footerCtaTitle = document.querySelector(".footer-cta-title");

const headerLinks = document.querySelectorAll(".header-links__link");

const rootElem = document.documentElement; // For CSS variables

let bodyPadding = parseInt(
  getComputedStyle(rootElem).getPropertyValue("--body-padding"),
  10
);

const tabPositioning = () => {
  firstFooterNavLink.addEventListener("focus", () => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  headerLogo.addEventListener("focus", () => {
    window.scrollTo(0, 0);
  });
};

tabPositioning();

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

  // Account for different pages, some pages don't have heroSubText
  const hasScrolled = scrollPosition >= scrollFromTop;

  siteHeader.classList.toggle("scroll-active", hasScrolled);
  headerLinks.forEach((link) =>
    link.setAttribute("tabindex", hasScrolled ? "-1" : "")
  );
  menuBtn.setAttribute("aria-hidden", String(!hasScrolled));
  menuBtn.setAttribute("tabindex", hasScrolled ? "0" : "-1");

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

    siteFooter.classList.toggle("footer-scroll-bottom", atBottom);

    if (atBottom) {
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

    // CTA logic - scroll bottom
    if (scrollHeight - (scrollPosition + clientHeight) < threshold2) {
      ctaWrapper.classList.add("scroll-bottom");
    } else {
      ctaWrapper.classList.remove("scroll-bottom");
    }
  };

  if (minMd.matches) {
    handleScrollBottom(
      footerLinksDistance - bodyPadding - 4, // Maintain 4px in _globals.scss as well - search banana
      footerCtaTitleDistance - bodyPadding - 56 // Maintain 56px in _globals.scss as well
    );
  } else {
    handleScrollBottom(
      footerLinksDistance - bodyPadding - 16,
      footerCtaTitleDistance - bodyPadding - 20
    );
  }

  // CTA position based on different pages
  if (heroSubText) {
    ctaHeroPosition =
      heroSubText.getBoundingClientRect().bottom + scrollPosition + 48;
  } else {
    ctaHeroPosition = clientHeight - bodyPadding;
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
